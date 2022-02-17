/**
 * Javascript-i18n-core
 * Simple i18n solution for javascript
 *
 * Github: https://github.com/essoduke/javascript-i18n-core
 * Demo:   https://code.essoduke.org/i18n
 * author: essoduke <essoduke@gmail.com>
 *
 * MIT License.
 */

/** check is Object */
const isObject = obj => obj instanceof Object && !Array.isArray(obj) && null !== obj;
/** check if JSON string */
const isJSON = (item) => {
    item = typeof item !== 'string' ? JSON.stringify(item) : item;
    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }
    return (item instanceof Object && null !== item) ? true : false;
}
/**
 * Extends Date
 */
class IDate extends Date {

    #day;
    #days;
    #month;
    #months;
    #meta;

    constructor (res) {

        super();

        // set to UTC
        this.setFullYear(this.getUTCFullYear());
        this.setMonth(this.getUTCMonth());
        this.setDate(this.getUTCDate());
        this.setHours(this.getUTCHours());
        this.setMinutes(this.getUTCMinutes());
        this.setSeconds(this.getUTCSeconds());

        if (isObject(res) && '__meta__' in res) {
            const meta = res['__meta__'];
            if (meta) {
                this.#meta = meta;
                this.#day = 'day' in meta ? meta.day : undefined;
                this.#days = 'days' in meta ? meta.days : undefined;
                this.#month = 'month' in meta ? meta.month : undefined;
                this.#months = 'months' in meta ? meta.months : undefined;
            }
        }
    }

    /** functions */
    replaceChar () {
        const self = this;
        return {
            d: () => (self.getDate() < 10 ? '0' : '') + self.getDate(),
            D: () => self.#day ? self.#day[self.getDay()] : '',
            j: () => self.getDate(),
            l: () => self.#days ? self.#days[self.getDay()] : '',
            N: () => self.getDay() + 1,
            S: () => {
                return (
                    self.getDate() % 10 === 1 && self.getDate() !== 11 ?
                    'st' :
                    (self.getDate() % 10 === 2 && self.getDate() !== 12 ? 'nd' :
                        (self.getDate() % 10 === 3 && self.getDate() !== 13 ? 'rd' : 'th')
                    )
                );
            },
            w: () => self.getDay(),
            z: () => '',
            W: () => '',
            F: () => self.#months[self.getMonth()],
            m: () => (self.getMonth() < 9 ? '0' : '') + (self.getMonth() + 1),
            M: () => self.#month[self.getMonth()],
            n: () => self.getMonth() + 1,
            t: () => '',
            L: () => '',
            o: () => '',
            Y: () => self.getFullYear(),
            y: () => ('' + self.getFullYear()).substr(2),
            B: () => '',
            g: () => self.getHours() %12 || 12,
            G: () => self.getHours(),
            h: () => ((self.getHours() % 12 || 12 ) < 10 ? '0' : '' ) + (self.getHours() %12 || 12),
            H: () => (self.getHours() < 10 ? '0' : '') + self.getHours(),
            i: () => (self.getMinutes() < 10 ? '0' : '') + self.getMinutes(),
            s: () => (self.getSeconds() < 10 ? '0' : '') + self.getSeconds(),
            e: () => '',
            I: () => '',
            O: () => ((-self.getTimezoneOffset() < 0 ? '-' : '+') +
                     (Math.abs(self.getTimezoneOffset() / 60) < 10 ? '0' : '') +
                     (Math.abs(self.getTimezoneOffset() / 60)) + '00'),
            T: () => {
                const m = this.getMonth();
                self.setMonth(0);
                const result = self.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');
                self.setMonth(m);
                return result;
            },
            Z: () => -self.getTimezoneOffset() * 60,
            c: () => '',
            r: () => self.toString(),
            U: () => self.getTime() / 1000
        }
    }

    /** Format string convert */
    format (format) {
        const self = this;
        const replace = self.replaceChar();
        let returnStr = [], curChar;

        try {
            for (let i = 0; i < format.length; i += 1) {
                curChar = format.charAt(i);
                returnStr.push(curChar.length ? (curChar in replace ? replace[curChar].call(self) : curChar) : '');
            }
        } catch (ignore) {
            console.error(ignore);
        }
        return returnStr.join('');
    }
}

/**
 * I18N Class
 *
 * @class
 */
export default new class I18N {

    #date;
    #props;

    /**
     * I18N
     *
     * @constructor
     */
    constructor () {

        //
        this.ver = 'A.2.1';

        // Private properties
        this.#props = {
            'resource': null,
            'locale': null,
            'cache': true,
            'i18n_key': 'i18n',
            'i18n_pass': 'i18n-pass'
        };
        return this;
    }

    /**
     * Get private property
     *
     * @param  {Object}  key - Property name
     */
    get (key) {
        return key in this.#props ? this.#props[key] : null;
    }

    /**
     * Set property
     *
     * @param  {string}  key  - Property name
     * @param  {mixed}  value  - Property value
     */
    set (key, value) {
        // set by key-value pair object
        if (isObject(key)) {
            for (let k in key) {
                this.#props[k] = key[k];
            }
        } else {
            this.#props[key] = value;
        }
        return this;
    }

    /**
     * Initialize
     *
     * @param  {Function}  callback
     */
    init (callback) {
        return this.locale(callback);
    }

    /**
     * Get current datetime
     *
     * @param  {string}  language  - Language to translate
     * @param  {string}  format  - Custom date format
     * @return  {string}
     */
    now (language, format) {

        const d = this.#date;
        const locale = language ?? this.#props.locale;

        try {
            const {timezone, datetime} = this.meta(true, locale);

            if (!isNaN(timezone)) {
                d.setHours(d.getHours() + timezone);
            }
            return d.format(format ?? datetime);
        } catch (ignore) {
            console.warn(ignore);
        }
    }

    /**
     * Auto translate i18n elements
     *
     * @param  {string}  language  Language to translate
     */
    translate (language) {

        const self = this;
        let locale = self.#props.locale; // keep current language

        let __key  = self.#props.i18n_key.replace('data-', '');
        let __pass = self.#props.i18n_pass.replace('data-', '').replace(/-([a-z])/g, g => g[1].toUpperCase());

        // get locale code
        self.#props.locale = language ?? locale;

        self.locale(() => {
            document.querySelectorAll(`[data-${__key}]`).forEach(tag => {
                try {
                    let key = tag.dataset[__key];
                    if (__pass in tag.dataset) {
                        let params = tag.dataset[__pass];
                        tag.innerHTML = self._(key, isJSON(params)? JSON.parse(params) : params);
                    } else {
                        tag.innerHTML = self._(key);
                    }
                } catch (ignore) {
                    console.error(ignore);
                }
            });
            // reset to default language
            self.#props.locale = locale;
        });
    }

    /**
     * Fetch resource content
     *
     * @param  {function}  callback
     * @return {Promise}
     */
    async locale (callback) {

        const self = this;
        let res  = self.#props.resource;
        const locale = self.#props.locale;
        const headers = new Headers({
            'Content-Type': 'application/json;charset=utf-8'
        });
        const cache = self.#props.cache;
        const opts = {
            'headers': headers
        };

        opts.cache =  cache ? 'force-cache' : 'no-store';

        // File path
        if ('string' === typeof res) {

            if (!cache) {
                res += `?_ts_=${new Date().getTime()}`;
            }

            await fetch(res, opts)
                .then(response => response.json())
                .then(dict => {
                    self.#props.resource = dict;
                    if (locale in dict) {
                        // meta
                        self.#date = new IDate(dict[locale])
                        //
                        if ('function' === typeof callback) {
                            callback.call(this, dict[locale]);
                        }
                    }

                })
                .catch(err => {
                    console.error(err);
                });

        } else if (isObject(res)) {
        // internal object
            if (locale in res) {
                // meta
                self.#date = new IDate(res[locale])
                //
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
     * @param  {string|bool}  key - META key
     * @return {string|object}
     */
    meta (key, lang) {
        const self = this;
        const res  = self.#props.resource;
        const locale = lang ?? self.#props.locale;

        if ('undefined' !== typeof res && locale in res) {
            if ('__meta__' in res[locale]) {
                let m = res[locale]['__meta__'];
                return (key in m ? m[key] : m);
            }
        }
    }

    /**
     * Get string (if not exists return the key)
     *
     * i18n._("key");
     * i18n._("key", object);
     * i18n._("key", [1, 2,...]);
     * i18n._("key", "value", ..value);
     * i18n._("jp", "key", object);
     * i18n._("en", "key", ..value);
     *
     * @param  {string}  args...
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
            if (isObject(o)) {
                o = false;
            } else {
                o = String(o).replace(pattern, (match, index) => {
                    return value[index];
                });
            }
        } else {

            value.forEach(arg => {
                // object
                if (isObject(arg)) {
                    for (let ik in arg) {
                        let r = new RegExp(`\\{${ik}\\}`, 'gi');
                        o = String(o).replace(r, arg[ik]);
                    }
                } else if (Array.isArray(arg)) {
                // Array
                    let s = -1;
                    o = String(o).replace(pattern, (match, index) => {
                        return arg[s += 1];
                    });
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
