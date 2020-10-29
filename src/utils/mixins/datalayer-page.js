export default {
    methods: {
        datalayerPageview(title) {
            const titleTemplate = this.$root.$options.metaInfo.titleTemplate;

            window.dataLayer.push({
                event: 'pageview',
                title: titleTemplate(title)
            });
        },
        datalayerImageView({title, image}) {
            const titleTemplate = this.$root.$options.metaInfo.titleTemplate;
            const url = document.location.href.replace(/&pid=\d+/, `&pid=${image}`);

            window.dataLayer.push({
                event: 'imageview',
                title: titleTemplate(title),
                url
            });
        }
    }
};
