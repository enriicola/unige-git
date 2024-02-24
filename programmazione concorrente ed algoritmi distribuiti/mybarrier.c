#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>

typedef struct mybarrier {
	pthread_mutex_t m;
	pthread_cond_t c;
	unsigned count;
	unsigned waiting;
} mybarrier_t;

mybarrier_t barrier;

void mybarrier_init(mybarrier_t *b, unsigned count) {
	b->count = count;
	b->waiting = 0;
	pthread_mutex_init(&b->m, NULL);
	pthread_cond_init(&b->c, NULL);
}

void mybarrier_wait(mybarrier_t *b) {
	pthread_mutex_lock(&b->m);

	if (++b->waiting < b->count) {
		pthread_cond_wait(&b->c, &b->m);
		pthread_mutex_unlock(&b->m);
		return;
	}

	b->waiting = 0;
	pthread_cond_broadcast(&b->c);
	pthread_mutex_unlock(&b->m);
}

void *thread_main(void *data) {
	printf("Hello from thread %ld before barriers\n", (long)data);
	mybarrier_wait(&barrier);
	printf("Hello from thread %ld after first barrier\n", (long)data);
	mybarrier_wait(&barrier);
	printf("Hello from thread %ld after second barrier\n", (long)data);
	return 0;
}

#define THREAD_COUNT 4
int main() {
	mybarrier_init(&barrier, THREAD_COUNT);
	pthread_t tid[THREAD_COUNT];
	for (long i = 0; i < THREAD_COUNT; i++) {
		pthread_create(tid + i, 0, thread_main, (void *)i);
	}

	void *ret;
	for (int i = 0; i < THREAD_COUNT; i++) {
		pthread_join(tid[i], &ret);
	}
}
