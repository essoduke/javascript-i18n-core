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
/**
 * Date
 */
class Dates extends Date {

    #version;
    #month;
    #months;
    #days;
    #day;

    constructor (opts) {

        super();

        const d = this;

        this.#version = 'A.1';

        if (opts.hasOwnProperty('day') && opts.hasOwnProperty('days') &&
            opts.hasOwnProperty('month') && opts.hasOwnProperty('months')
        ) {
            this.#month  = opts.month;
            this.#months = opts.months;
            this.#day    = opts.day;
            this.#days   = opts.days;
            this.replaceChars = {
                d: () => (d.getUTCDate() < 10 ? '0' : '') + d.getUTCDate(),
                D: () => this.#day[this.getUTCDay()],
                j: () => d.getUTCDate(),
                l: () => this.#days[d.getUTCDay()],
                N: () => d.getDay() + 1,
                S: () => {
                    return (
                        d.getUTCDate() % 10 === 1 && d.getUTCDate() !== 11 ?
                        'st' :
                        (d.getUTCDate() % 10 === 2 && d.getUTCDate() !== 12 ? 'nd' :
                            (d.getUTCDate() % 10 === 3 && d.getUTCDate() !== 13 ? 'rd' : 'th')
                        )
                    );
                },
                w: () => d.getUTCDay(),
                z: () => '',
                W: () => '',
                F: () => this.#months[d.getUTCMonth()],
                m: () => (d.getUTCMonth() < 9 ? '0' : '') + (d.getUTCMonth() + 1),
                M: () => this.#month[d.getUTCMonth()],
                n: () => String(d.getUTCMonth() + 1),
                t: () => '',
                L: () => '',
                o: () => '',
                Y: () => String(d.getUTCFullYear()),
                y: () => ('' + d.getUTCFullYear()).substr(2),
                B: () => '',
                g: () => String(d.getUTCHours() %12 || 12),
                G: () => String(d.getUTCHours()),
                h: () => ((d.getUTCHours() % 12 || 12 ) < 10 ? '0' : '' ) + (d.getUTCHours() %12 || 12),
                H: () => (d.getUTCHours() < 10 ? '0' : '') + String(d.getUTCHours()),
                i: () => (d.getUTCMinutes() < 10 ? '0' : '') + String(d.getUTCMinutes()),
                s: () => (d.getUTCSeconds() < 10 ? '0' : '') + String(d.getUTCSeconds()),
                e: () => '',
                I: () => '',
                O: () => {
                    return String(-d.getTimezoneOffset() < 0 ? '-' : '+') +
                           String(Math.abs(d.getTimezoneOffset() / 60) < 10 ? '0' : '') +
                           String(Math.abs(d.getTimezoneOffset() / 60)) + '00';
                },
                T: () => {
                    d.setMonth(0);
                    let m = d.getUTCMonth();
                    let result = d.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');
                    d.setMonth(m);
                    return result;
                },
                Z: () => String(-d.getTimezoneOffset() * 60),
                c: () => '',
                r: () => d.toString(),
                U: () => String(d.getUTCTime() / 1000)
            }
        }
    }

    //
    format (f) {
        const replace = this.replaceChars;
        let returnStr = [], curChar;
        for (let i = 0; i < f.length; i += 1) {
            curChar = f.charAt(i);
            returnStr.push(curChar in replace ? replace[curChar].call(this) : curChar);
        }
        return returnStr.join('');
    }

    /**
     * Similar the ASP Dateadd function
     */
     dateAdd (interval, number) {
        let d = this;
        number = parseInt(number, 10);
        switch (interval) {
        case 'y':
            d.setFullYear(d.getFullYear() + number);
            break;
        case 'm':
            d.setMonth(d.getMonth() + number);
            break;
        case 'd':
            d.setDate(d.getDate() + number);
            break;
        case 'w':
            d.setDate(d.getDate() + 7 * number);
            break;
        case 'h':
            d.setHours(d.getHours() + number);
            break;
        case 'n':
            d.setMinutes(d.getMinutes() + number);
            break;
        case 's':
            d.setSeconds(d.getSeconds() + number);
            break;
        case 'l':
            d.setMilliseconds(d.getMilliseconds() + number);
            break;
        }
        return d;
    }
}
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
        self.#props.locale = language ?? self.#props.locale;

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
            console.log(self);
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
                    if (locale in dict && '__meta__' in dict[locale]) {
                        const m = dict[locale]['__meta__'];
                        if ('undefined' !== typeof m && 'datetime' in m) {
                            self.#date = new Dates(m);
                        }
                    }
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
            if (locale in res && '__meta__' in res[locale]) {
                const m = res[locale]['__meta__'];
                if ('undefined' !== typeof m && 'datetime' in m) {
                    self.#date = new Dates(m);
                }
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
     * Date object
     *
     * @return {Date}
     */
    now () {
        const self = this;
        const {utc}  = self.meta(true);
        return 'number' === typeof utc ? self.#date.dateAdd('h', utc) : self.#date;
    }

    /**
     * Formatted Date string
     *
     * @param  {string}  format  Date format (PHP date)
     * @return {string}
     */
    datetime (format) {
        const self = this;
        const {datetime}  = self.meta(true);
        return self.#date.format(format ?? datetime);
    }

    /**
     * META info
     *
     * @param  {string}  key  META key
     * @return {string|object}
     */
    meta (key) {
        const self = this;
        if ('undefined' !== typeof self.#dict && '__meta__' in self.#dict) {
            let m = self.#dict['__meta__'];
            if (m.hasOwnProperty(key)) {
                return m[key];
            } else if (key === true) {
                return m;
            }
        }
    }

    /**
     * Get translation (if not exists return key string)
     *
     * @param  {string}  arg0  Locale key (Optional)
     * @param  {string}  arg1  Dictionary Key
     * @param  {mixed}   arg...  The variables to replace by order. (Optional)
     * @return {string}
     */
    _ () {

        const self = this;
        const locale = self.#props.locale;
        const res = self.#props.resource;
        const args = arguments;
        let key, value;
        let o, keys;

        if (locale in res) {
            o = res[locale];
        } else {
            o = res;
        }

        console.log('args[0]', args[0],  o.hasOwnProperty(args[0]) );

        if (o.hasOwnProperty(args[0])) {
            key = args[1];
            value = args[2];
        } else  {
            key = args[0];
            value = args[1];
        }

        if ('undefined' !== typeof key) {
            keys = key.split(/\./gi);
        }

        keys.forEach(k => {
            if (k in o) {
                o = o[k];
            }
        });

        // for object
        if (value instanceof Object && !Array.isArray(value) && null !== value) {
            for (let ik in value) {
                let r = new RegExp(`\\{${ik}\\}`, 'gi');
                o = String(o).replace(r, value[ik]);
            }
        }
        return o;
    }
}
//#EOF
