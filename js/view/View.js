class View {

	static getInpValue(inpID) {
		return $('#' + inpID).val();
	}

	static setInpValue(inpID, value = '') {
		$('#' + inpID).val(value).change();
	}

	static error(msg, attachTo=null) {
		if (config.sound) new Audio('./assets/audio/error.wav').play();
		if (attachTo) {
			this.#attachTo(msg, 'error', attachTo);
		} else {
			$.notify(msg, 'error');
		}
	}

	static success(msg, attachTo=null) {
		if (config.sound) new Audio('./assets/audio/success.wav').play();
		if (attachTo) {
			this.#attachTo(msg, 'success', attachTo);
		} else {
			$.notify(msg, 'success');
		}
	}

	static warn(msg, attachTo=null) {
		if (config.sound) new Audio('./assets/audio/notification.ogg').play();
		if (attachTo) {
			this.#attachTo(msg, 'warn', attachTo);
		} else {
			$.notify(msg, 'warn');
		}
	}

	static #attachTo(msg, status, attachTo) {
		$('#' + attachTo).notify(msg, status, {position: 'bottom left'});
	}

	static isVisible(elemID) {
		return $('#' + elemID).is(":visible");
	}

	static getReadableHourMinDate(time) {
		let d = new Date(time);
		return this.fTime(d.getHours()) + ':' + this.fTime(d.getMinutes()) + ' / ' + this.fTime(d.getDate()) + '.' + this.fTime(d.getMonth()) + '.' + d.getFullYear();
	}
	
	static fTime(time) {
		return ('0'+time).slice(-2);
	}

	static getReadableMinSec(time) {
		let t = new Date(time);
		return this.fTime(t.getMinutes()) + ':' + this.fTime(t.getSeconds());
	}

}
