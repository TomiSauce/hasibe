class FlagView extends View {

	static generateSelectOptions(flags, selectedID = null) {
		let out = '';
		for (let flag of flags) {
			out += '<option value="' + flag.get('id') + '"' + ((flag.get('id') == selectedID) ? ' selected ' : '') + '>' + flag.get('text') + '</option>';
		}
		return out;
	}

}
