class RankView {

	static generateSelectOptions(ranks, selectedID = null) {
		let out = '';
		for (let rank of ranks) {
			out += '<option value="' + rank.get('id') + '"' + ((rank.get('id') == selectedID) ? ' selected ' : '') + '>' + rank.get('abbr') + '</option>';
		}
		return out;
	}

}
