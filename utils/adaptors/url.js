import { SITE } from '~/utils/constants';

export default (link) => new URL(link, SITE.LINK);
