#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

static const int DEFAULT_BUFFER_SIZE = 1024;
static const int MAX_SIZE = 8192;

static void my_close(int fd)
{
	if (close(fd)) perror("my_close");
}

static int cat_fd(const int fd, const char * const pathname);

static int cat_file(const char *const pathname)
{
	const int fd = open(pathname, O_RDONLY);
	if (fd < 0) {
	    fprintf(stderr, "Impossible to open file: %s (%s)\n", pathname, strerror(errno));
	    return -1;
	}
	return cat_fd(fd, pathname);
}

static int write_all(char *buffer, ssize_t count)
{
	ssize_t n_total_written = 0;
	ssize_t offset = 0;
	while (n_total_written < count) {
		const ssize_t n_written = write(STDOUT_FILENO, buffer + offset, count - n_total_written);
		if (n_written < 0) {
			fprintf(stderr, "Cannot write to stdout.\n");
			return -1;
		}
		n_total_written += n_written;
		offset +=  n_written;
	}
	return count;
}

static off_t calculate_buffer_size(int fd)
{
	struct stat st;
	if (fstat(fd, &st) < 0)
		return -1;
	off_t buf_size = (st.st_mode&S_IFMT)==S_IFREG ? st.st_size : DEFAULT_BUFFER_SIZE;
	if (buf_size > MAX_SIZE)
		buf_size = MAX_SIZE;
	return buf_size;
}

static int cat_fd(const int fd, const char * const pathname)
{
	off_t buf_size = calculate_buffer_size(fd);
	if (buf_size < 0) {
		fprintf(stderr, "Cannot read metadata of %s (%s)\n", pathname, strerror(errno));
		my_close(fd);
		return -1;
	}
	char * const buffer = malloc(buf_size);
	if (buffer == NULL) {
	    fprintf(stderr, "Cannot allocate the buffer.\n");
	    my_close(fd);
	    return -1;
	}
	for(;;) {
		const ssize_t n_read = read(fd, buffer, buf_size);
		if (n_read < 0) {
			if (pathname)
				fprintf(stderr, "Impossible to read from file: %s\n", pathname);
			else
				fprintf(stderr, "Cannot read from stdin?!?!?\n");
cleanup_and_fail:
			free(buffer);
			my_close(fd);
			return -1;
		}
		if (n_read == 0)
			break;
		if (write_all(buffer, n_read) < 0)
			goto cleanup_and_fail;
	}
	my_close(fd);
	free(buffer);
	printf("\n");
	return 0;
}

int main(int argc, char *argv[])
{
	if (argc < 2)
		cat_fd(STDIN_FILENO, 0);
	else for (int i = 1; i < argc; ++i)
		cat_file(argv[i]);
}
