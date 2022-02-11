/**
 * javascript-i18n-core
 * Simply i18n solution for javascript
 *
 * Github: https://github.com/essoduke/javascript-i18n-core
 * author: essoduke <essoduke@gmail.com>
 *
 * (c)2022 MIT License.
 *
 * --Usage--
 * i18n.set(
 *     'resource': 'path or language object',
 *     'locale', 'current language key'
 * }).init();
 *
 * i18n._('key', 'value');
 * i18n._('locale', 'key', 'value');
 *
 * i18n.init(callback);
 * // Elements auto translate by current locale
 * i18n.translate();
 * // Specified language
 * i18n.translate('tw');
 */
// export
export default new class I18N {

    #version;
    #date;
    #dict;
    #props;

    constructor () {

        //
        this.#version = 'A.1';

        // Private properties
        this.#props = {
            'resource': null,
            'locale': null
        };
        return this;
    }

    /**
     * Constructor
     *
     * @param  {object}  Settings to override
     * @constructor
     */

    get (key) {
        if ('undefined' !== typeof this.#props[key]) {
            return this.#props[key];
        }
    }

    set (key, value) {
        // set by key-value pair object
        if (key instanceof Object && !Array.isArray(key) && null !== key) {
            for (let k in key) {
                this.#props[k] = key[k];
            }
        } else {
            this.#props[key] = value;
        }
        return this;
    }

    /**
     *
     */
    init (callback) {

        return this.locale(callback);

    }

    // [data-i18n="key"] {text} or [data-i18n-key]
    translate (language) {

        const self = this;
        let locale = self.#props.locale; // keep current language
        self.#props.locale = language ?? locale;

        self.locale(function (dict) {
            document.querySelectorAll('[data-i18n]').forEach(function (tag) {
                let k = tag.dataset.i18n, p;
                try {
                    p = 'i18nPass' in tag.dataset ? JSON.parse(tag.dataset.i18nPass) : null;
                    if (null !== p) {
                        if (p instanceof Object && !Array.isArray(p)) {
                            tag.innerHTML = self._(k, p);
                        }
                    } else {
                        tag.innerHTML = self._(k);
                    }

                } catch (ignore) {
                    console.error(ignore);
                }
                //tag.innerHTML = self._(tag.dataset.i18n)
            });
            // reset to default language
            self.#props.locale = locale;
        });
    }

    /**
     * Fetch dictionary file or structure
     *
     * @param  {string}  path  File path or key of dictionary
     * @param  {function}  callback  Callback function while dictionary was loaded (optional).
     * @return {Promise}
     */
    async locale (callback) {

        const self = this;
        const res  = self.#props.resource;
        const locale = self.#props.locale;
        const opts = {
            headers: new Headers({
                'Content-Type': 'application/json;charset=utf-8'
            })
        };

        // File path
        if ('string' === typeof res) {
            await fetch(res, opts)
                .then(response => response.json())
                .then(dict => {
                    self.#props.resource = dict;
                    //
                    if ('function' === typeof callback) {
                        callback.call(this, dict[locale]);
                    }

                })
                .catch(err => {
                    console.error(err);
                });

        } else if (res instanceof Object && null !== res) {
        // internal object
            if (locale in res) {
                if ('function' === typeof callback) {
                    callback.call(this, res[locale]);
                }
            }
        } else {
            throw new Error('unexcept error');
        }
        return self;
    }

    /**
     * META info
     *
     * @param  {string}  key  META key
     * @return {string|object}
     */
    meta (key, lang) {
        const self = this;
        const res  = self.#props.resource;
        const locale = lang ?? self.#props.locale;
        if ('undefined' !== typeof res && locale in res) {
            if ('__meta__' in res[locale]) {
                let m = res[locale]['__meta__'];
                return key in m ? m[key] : m;
            }
        }
    }

    /**
     * Get translation (if not exists return key string)
     *
     * i18n._('key', object);
     * i18n._('key', value, ..n);
     * i18n._('en', 'key', object);
     * i18n._('en', 'key', ..n);
     *
     * @param  {string}  arg0  Locale key (Optional)
     * @param  {string}  arg1  Dictionary Key
     * @param  {mixed}   arg...  The variables to replace by order. (Optional)
     * @return {string}
     */
    _ () {

        const self = this;
        const res  = self.#props.resource;
        const args = arguments;
        let locale = self.#props.locale;
        let key, value, o, keys;

        // arg1 is locale
        if (args[0] in res) {
            locale = args[0];
            key = args[1];
            value = Array.prototype.slice.call(args, 2);
            o = res[args[0]];
        } else {
            // defualt language
            if (locale in res) {
                o = res[locale];
                key = args[0];
                value = Array.prototype.slice.call(args, 1);
            } else {
                o = {};
            }
        }

        if ('undefined' !== typeof key) {
            keys = key.split(/\./gi);
        }

        keys.forEach(k => {
            if (k in o) {
                o = o[k];
            }
        });

        // Default pattern for {word}
        const pattern = new RegExp('\\{(\\w+)\\}', 'gi');

        if (value.length === 0) {
            o = String(o).replace(pattern, (match, index) => {
                return value[index];
            });
        } else {
            // for object
            // only object
            value.forEach((arg) => {
                if (arg instanceof Object && !Array.isArray(arg) && null !== arg) {
                    for (let ik in arg) {
                        let r = new RegExp(`\\{${ik}\\}`, 'gi');
                        o = String(o).replace(r, arg[ik]);
                    }
                } else {
                // others args
                    let s = -1;
                    o = String(o).replace(pattern, () => {
                        return value[s += 1];
                    });
                }
            });
        }

        return o;

    }
}
//#EOF
