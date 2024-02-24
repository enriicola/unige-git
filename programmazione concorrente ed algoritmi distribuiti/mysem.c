#include <pthread.h>

typedef struct {
	pthread_mutex_t m;
	pthread_cond_t c;
	int count;
} mysem_t;

void mysem_init(mysem_t *s, int count) {
	s->count = count;
	pthread_mutex_init(&s->m, NULL);
	pthread_cond_init(&s->c, NULL);
}

void mysem_down(mysem_t *s) {
	pthread_mutex_lock(&s->m);

	--s->count;
	while (s->count < 0)
		pthread_cond_wait(&s->c, &s->m);

	pthread_mutex_unlock(&s->m);
}

void mysem_up(mysem_t *s) {
	pthread_mutex_lock(&s->m);
	++s->count;
	pthread_cond_signal(&s->c);
	pthread_mutex_unlock(&s->m);
}

int main() {}
