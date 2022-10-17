//Vue Custom Directives
Vue.directive('init', {
	bind: function (el, binding, vnode) {
		if (binding.value instanceof Function) {
			vnode.context[binding.expression]();
		} else {
			vnode.context[binding.arg] = binding.value;
		}
	}
})

//Vue Custom Filters
Vue.filter('capitalize', function (value) {
	if (!value) return ''
	value = value.toString()
	return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('lowercase', function (value) {
	if (!value) return ''
	value = value.toString();
	return value.toLowerCase();
});

Vue.filter('uppercase', function (value) {
	if (!value) return ''
	value = value.toString();
	return value.toUpperCase();
});

Vue.filter('limitTo', function (value, limited) {
	if (limited === undefined || value === undefined) {
		return value;
	}
	if (typeof value === 'string') {
		return value.substring(0, limited);
	}
	if (typeof value === 'number') {
		return value.toString().substring(0, limited);
	}
	return value;
});

Vue.filter('date', function (value, dateFormat) {
	let df;
	switch (dateFormat) {
		case 'short':
			df = 'M/d/yy h:mm a';
			break;
		case 'medium':
			df = 'MMM d, y h:mm:ss a';
			break;
		case 'fullDate':
			df = 'EEEE, MMMM d, y';
			break;
		case 'longDate':
			df = 'MMMM d, y';
			break;
		case 'mediumDate':
			df = 'MMM d, y';
			break;
		case 'shortDate':
			df = 'M/d/yy';
			break;
		case 'mediumTime':
			'h:mm:ss a';
			break;
		case 'shortTime':
			df = 'h:mm a';
			break;
		default:
			df = dateFormat;
			break;
	}
	return moment(String(value)).format(df);
});

Vue.filter('slice', function (arr, start, end) {
	if (Array.isArray(arr)) {
		return arr.slice(start, end);
	}
	return arr;
});

Vue.filter('replace', function (value, oldString, newString) {
	return String(value).replace(oldString, newString);
})

Vue.use(VueUtilPlugin);
Vue.use(window.vuelidate.default);
const { required, minLength } = window.validators

Vue.mixin({
	methods: {
		toggleLoadingComponent: function (enableLoading, divId, loadingId, isInitial, copyContent) {
			if (enableLoading) {
				if (!isInitial) {
					$("#" + divId).show();
				} else {
					$("#" + divId).hide();
				}
				$("#" + loadingId).show();
			} else {
				if (!copyContent) {
					$("#" + divId).show();
				} else {
					$("#" + divId).hide();
				}
				$("#" + loadingId).hide();
			}
		},
		orderBy: function (arr) {
			var _comparator = null;
			var sortKeys;
			arr = Vue._vueUtil.convertArray(arr); // determine order (last argument)

			var args = Vue._vueUtil.toArray(arguments, 1);
			var order = args[args.length - 1];

			if (typeof order === 'number') {
				order = order < 0 ? -1 : 1;
				args = args.length > 1 ? args.slice(0, -1) : args;
			} else {
				order = 1;
			} // determine sortKeys & comparator

			var firstArg = args[0];

			if (!firstArg) {
				return arr;
			} else if (typeof firstArg === 'function') {
				// custom comparator
				_comparator = function comparator(a, b) {
					return firstArg(a, b) * order;
				};
			} else {
				// string keys. flatten first
				sortKeys = Array.prototype.concat.apply([], args);

				_comparator = function comparator(a, b, i) {
					i = i || 0;
					return i >= sortKeys.length - 1 ? baseCompare(a, b, i) : baseCompare(a, b, i) || _comparator(a, b, i + 1);
				};
			}

			function baseCompare(a, b, sortKeyIndex) {
				var sortKey = sortKeys[sortKeyIndex];

				if (sortKey) {
					if (sortKey !== '$key') {
						if (Vue._vueUtil.isObject(a) && '$value' in a) a = a.$value;
						if (Vue._vueUtil.isObject(b) && '$value' in b) b = b.$value;
					}

					a = Vue._vueUtil.isObject(a) ? Vue._vueUtil.getPath(a, sortKey) : a;
					b = Vue._vueUtil.isObject(b) ? Vue._vueUtil.getPath(b, sortKey) : b;
					a = typeof a === 'string' ? a.toLowerCase() : a;
					b = typeof b === 'string' ? b.toLowerCase() : b;
				}

				return a === b ? 0 : a > b ? order : -order;
			} // sort on a copy to avoid mutating original array


			return arr.slice().sort(_comparator);
		},
		filterBy: function (arr, search) {
			var arr = Vue._vueUtil.convertArray(arr);

			if (search == null) {
				return arr;
			}

			if (typeof search === 'function') {
				return arr.filter(search);
			} // cast to lowercase string


			search = ('' + search).toLowerCase();
			var n = 2; // extract and flatten keys

			var keys = Array.prototype.concat.apply([], Vue._vueUtil.toArray(arguments, n));
			var res = [];
			var item, key, val, j;

			for (var i = 0, l = arr.length; i < l; i++) {
				item = arr[i];
				val = item && item.$value || item;
				j = keys.length;

				if (j) {
					while (j--) {
						key = keys[j];

						if (key === '$key' && contains(item.$key, search) || contains(Vue._vueUtil.getPath(val, key), search)) {
							res.push(item);
							break;
						}
					}
				} else if (contains(item, search)) {
					res.push(item);
				}
			}

			function contains(val, search) {
				var i;

				if (Vue._vueUtil.isPlainObject(val)) {
					var keys = Object.keys(val);
					i = keys.length;

					while (i--) {
						if (contains(val[keys[i]], search)) {
							return true;
						}
					}
				} else if (Vue._vueUtil.isArray(val)) {
					i = val.length;

					while (i--) {
						if (contains(val[i], search)) {
							return true;
						}
					}
				} else if (val != null) {
					return val.toString().toLowerCase().indexOf(search) > -1;
				}
			}

			return res;
		},
		limitBy: function (arr, n, offset) {
			if (arr) {
				arr = Vue._vueUtil.isArray(arr) ? arr : Vue._vueUtil.convertRangeToArray(arr);
				offset = offset ? parseInt(offset, 10) : 0;
				n = Vue._vueUtil.toNumber(n);
				return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
			} else {
				return arr;
			}
		}
	}
})