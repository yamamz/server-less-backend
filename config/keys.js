import stripeSecretKeyDev from '../config/keys_dev';
import stripeSecretKeyProd from '../config/keys_prod';
let stripePublishableKey = ''
if (process.env.NODE_ENV === 'production') {
    stripePublishableKey = stripeSecretKeyProd.stripePublishableKey
} else {
    stripePublishableKey = stripeSecretKeyDev.stripePublishableKey
}
export default {
    stripePublishableKey: stripePublishableKey
}
