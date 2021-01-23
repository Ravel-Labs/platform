function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, '');
	str = str.toLowerCase();

	var from = "ãàáäâáº½èéëêìíïîõòóöôùúüûñç·/_,:;";
	var to = "aaaaaeeeeeiiiiooooouuuunc------";
	for (var i = 0, l = from.length; i < l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

	return str;
}

module.exports = {
	slugify,
};