/**
 * I18N class
 *
 * MIT License.
 *
 * --Usage--
 * set locale file: i18n.localte('/foo/boo.json');
 * set locale key: i18n.locale('tw') (for static dictionary)
 * get string: i18n._('key') --
 * get string with variables: i18n._('key', variables...)
 *
 * --Datetime--
 * get formatted date: i18n.datetime()
 *
 * --Dictionary--
 * [JSON file]
 * {
 *     "__meta__": { // language META configure
 *         "datetime": (string) "date format string". e.g. "Y-m-d H:i:s"
 *         "timezone": (string) "timezone number" e.g. "8"
 *         "month": (array) Short name of each Day. e.g. ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
 *         "months": (array) Full name of each Month. e.g.  ["January", "Feburary", "March", "April", "May", "June", "July", "August", "Sepetember", "October", "November", "December"],
 *         "day": (array) Short name of each day. e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
 *         "days": (array) Full name of each day. e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
 *     },
 *     // Structures
 *     "key": "string"
 *     "key": "string with variables {1}, {2}...{\d}",
 *     "key": {
 *         "_":  "string of current level",
 *         "key 1": "string 1"
 *         "key 2": {
 *             "key 3": "string 3"
 *         }
 *     }
 * }
 */

/**
 * Utilities
 */
class Utils {

    extend () {
        // Variables
        const extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        // Check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i += 1;
        }

        // Merge the object into the extended object
        const merge = obj => {
            let prop;
            for (prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If deep merge and property is an object, merge properties
                    extended[prop] = deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ?
                                     this.extend(true, extended[prop], obj[prop]) :
                                     obj[prop];
                }
            }
        };

        // Loop through each object and conduct a merge
        for (; i < length; i++ ) {
            const obj = arguments[i];
            merge(obj);
        }
        return extended;
    }
}
/**
 * Date
 */
class Dates extends Date {

    #month;
    #months;
    #days;
    #day;

    constructor (opts) {

        super();

        const d = this;

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
export default class I18N {

    #utils;
    #date;
    #dict;

    /**
     * Constructor
     *
     * @param  {object}  Settings to override
     * @constructor
     */
    constructor (setting = {}) {

        const __setting__ = {};

        this.#utils = new Utils();
        this.prop   = this.#utils.extend({}, __setting__, setting);
        //
        if (this.prop.lang) {
            this.locale(this.prop.lang);
        }
    }

    /**
     * Fetch dictionary file or structure
     *
     * @param  {string}  path  File path or key of dictionary
     * @param  {function}  callback  Callback function while dictionary was loaded (optional).
     * @return {Promise}
     */
    async locale (path, callback) {
        const self = this;
        const opts = {
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            cache: 'force-cache'
        };
        if (self.prop.hasOwnProperty('dict') && self.prop.dict.hasOwnProperty(path)) {
            self.#dict = self.prop.dict[path];
        } else {
            return await fetch(path, opts)
                .then(response => response.json())
                .then(dict => {
                    self.#dict = dict;
                    if (dict.hasOwnProperty('__meta__')) {
                        const m = dict['__meta__'];
                        if (m.hasOwnProperty('datetime')) {
                            self.#date = new Dates(m);
                        }
                    }
                    //
                    if ('function' === typeof callback) {
                        callback.call(this, dict);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
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
        if ('__meta__' in self.#dict) {
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
     * @param  {string}  arg1  Dictionary Key
     * @param  {mixed}  arg...  The variables to replace by order. (Optional)
     * @return {string}
     */
    _ () {

        const self = this;
        let o = self.#dict;
        let t, keys;

        if ('undefined' !== typeof arguments[0]) {
            keys = arguments[0].split(/\./gi);
        }

        keys.forEach(k => {
            if (k in o) {
                o = o[k];
            }
        });

        const pattern = new RegExp('\\{([1-' + arguments.length.toString() + '])\\}', 'g');

        if ('string' === typeof o && o.length > 0) {
            t = o;
        } else if ('object' === typeof o && o.hasOwnProperty('_')) {
            t = o['_'];
        }

        if ('string' === typeof t) {
            return String(t).replace(pattern, (match, index) => {
                return arguments[index];
            });
        }
        return arguments[0];
    }
}
//#EOF
