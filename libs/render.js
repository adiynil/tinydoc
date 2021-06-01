const render = function (origin, data) {
	var reg = /{{([a-zA-Z0-9_$][a-zA-Z0-9\.]+)}}/g;
	return origin.replace(reg, function (raw, key, offset, string) {
		var paths = data,
			ary = key.split(".");

		while (ary.length > 0) {
			paths = paths[ary.shift()];
		}

		return paths || raw;
	});
};
module.exports = render;
