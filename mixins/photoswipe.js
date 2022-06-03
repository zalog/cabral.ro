const PhotoSwipeModule = () => import('photoswipe/dist/photoswipe.esm');
const PhotoSwipeModuleCss = () => import('photoswipe/dist/photoswipe.css');

const setNaturalSizes = (imgEl, pswpContent) => {
    const { naturalWidth, naturalHeight } = imgEl;

    Object.assign(pswpContent.instance.options.dataSource[pswpContent.index], {
        width: `${naturalWidth}`,
        height: `${naturalHeight}`,
    });

    if (pswpContent.hasSlide) {
        Object.assign(pswpContent.slide, {
            width: naturalWidth,
            height: naturalHeight,
        });
    } else if (!pswpContent.slide) {
        Object.assign(pswpContent, {
            width: naturalWidth,
            height: naturalHeight,
        });
    }
};

export default {
    mounted() {
        const imgs = this.$refs.content?.querySelectorAll('img');

        if (!imgs?.length) return;

        this.pageTitleInitial = this.data.head.title;

        this.photoswipeSet({ imgs });

        const { hash } = this.$route;
        if (hash.includes('pid=')) {
            let [, index2open] = hash.split('=');
            index2open = Number(index2open) - 1;
            this.photoswipeInit({ index: index2open });
        }
    },

    methods: {
        photoswipeSet({ imgs }) {
            this.photoswipeOptions = {
                dataSource: [],
            };

            imgs.forEach((img, indexImg) => {
                const a = img.parentElement;

                if (a.nodeName !== 'A') return;

                a.setAttribute('data-pswp-index', indexImg);

                const size = img.getAttribute('data-orig-size')?.split(',') || [1, 1];
                const src = img.getAttribute('data-orig-file') || a.getAttribute('href');

                this.photoswipeOptions.dataSource.push({
                    src,
                    width: size[0],
                    height: size[1],
                });

                a.addEventListener('click', (event) => {
                    event.preventDefault();

                    this.photoswipeInit({ options: this.photoswipeOptions, index: indexImg });
                });
            });
        },
        async photoswipeLoad() {
            const [, PhotoSwipe] = await Promise.all([
                PhotoSwipeModuleCss(),
                PhotoSwipeModule(),
            ]);

            return PhotoSwipe.default;
        },
        async photoswipeInit({
            options = this.photoswipeOptions,
            index,
        }) {
            const imgFirstNeeded = new Image();
            imgFirstNeeded.src = options.dataSource[index].src;
            await imgFirstNeeded.decode();

            Object.assign(options.dataSource[index], {
                width: imgFirstNeeded.width,
                height: imgFirstNeeded.height,
            });

            const PhotoSwipe = await this.photoswipeLoad();

            const pswp = new PhotoSwipe({
                ...options,
                index,
            });

            pswp.addFilter('thumbEl', (thumbEl, data, indexCurrent) => document.querySelector(`a[data-pswp-index="${indexCurrent}"] img`) || thumbEl);

            pswp.addFilter('placeholderSrc', (placeholderSrc, slide) => this.photoswipeOptions.dataSource[slide.index].src || placeholderSrc);

            pswp.on('contentLoad', (eventPswp) => {
                const { content } = eventPswp;

                if (content.index === index) {
                    eventPswp.preventDefault();

                    content.element = imgFirstNeeded;
                    content.element.className = 'pswp__img';
                }
            });

            pswp.on('contentLoadImage', (eventPswp) => {
                eventPswp.preventDefault();

                const { content } = eventPswp;

                content.element = document.createElement('img');
                content.element.src = content.data.src;
                content.element.className = 'pswp__img';

                content.state = 'loading';

                if (content.element.complete) {
                    setNaturalSizes(content.element, content);

                    content.onLoaded();
                } else {
                    content.element.onload = function onload({ target: imgLoaded }) {
                        setNaturalSizes(imgLoaded, content);

                        content.onLoaded();
                    };

                    content.element.onerror = () => {
                        content.onError();
                    };
                }
            });

            pswp.on('contentAppendImage', (eventAppendImage) => {
                const { content } = eventAppendImage;

                content.element.decode().then(() => {
                    if (
                        content.width !== content.element.naturalWidth
                        || content.height !== content.element.naturalHeight
                    ) {
                        content.width = content.element.naturalWidth;
                        content.height = content.element.naturalHeight;

                        content.instance.updateSize(true);
                    }
                });
            });

            pswp.on('contentActivate', ({ content }) => {
                const itemNr = content.index + 1;
                const pageTitle = `${this.pageTitleInitial} - Image ${itemNr}`;

                this.$router.push({ hash: `pid=${itemNr}` }, (route) => {
                    this.$store.dispatch('data/setPageData', {
                        route,
                        prop: 'head.title',
                        data: pageTitle,
                    });

                    this.sendPageView({
                        title: pageTitle,
                        url: route.fullPath,
                    });
                });
            });

            pswp.on('close', () => {
                this.$router.push({ hash: false }, (route) => {
                    this.$store.dispatch('data/setPageData', {
                        route,
                        prop: 'head.title',
                        data: this.pageTitleInitial,
                    });
                });
            });

            pswp.init();
        },
    },
};
