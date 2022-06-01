export default {
    data: () => ({
        photoswipe: {
            index: false,
            items: [],
        },
    }),

    mounted() {
        this.setDataPhotoswipe();
    },

    methods: {
        setDataPhotoswipe() {
            const imgs = this.$refs.content?.querySelectorAll('img');

            if (!imgs?.length) return;

            imgs.forEach((img, index) => {
                const src = (img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-orig-file')).split('?')[0];
                const size = (img.getAttribute('data-orig-size') || '0,0').split(',');

                this.photoswipe.items.push({
                    src,
                    w: size[0],
                    h: size[1],
                });

                img.addEventListener('click', (event) => {
                    event.preventDefault();

                    this.photoswipe.index = index;
                });
            });

            this.pageTitleInitial = this.pageTitle;

            const { hash } = this.$route;
            if (hash.includes('pid=')) {
                const index = hash.split('=')[1];
                this.photoswipe.index = Number(index);
            }
        },
        onPhotoswipeUpdate(itemIndex) {
            const route = this.$route;
            const itemNr = itemIndex + 1;
            const pageTitle = `${this.pageTitleInitial} - Image ${itemNr}`;

            this.$store.dispatch('data/setPageData', {
                route,
                prop: 'head.title',
                data: pageTitle,
            });
            this.sendPageView({
                title: pageTitle,
                url: route.fullPath,
            });
        },
        onPhotoswipeClosed() {
            this.photoswipe.index = false;

            this.$store.dispatch('data/setPageData', {
                route: this.$route,
                prop: 'head.title',
                data: this.pageTitleInitial,
            });
        },
    },
};
