import { SITE } from '~/utils/constants';

const url = (link) => new URL(link, SITE.LINK);

export default url;
