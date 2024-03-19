class SortView {

    static getButtonState(elemID) {
        let elemClass = $('#' + elemID + '> i').attr('class');
        if (elemClass.endsWith('z-a')) {
            return 'z-a';
        } else if (elemClass.endsWith('a-z')) {
            return 'a-z';
        } else {
            return false;
        }
    }

    static switchButtonState(elemID) {
        let state = this.getButtonState(elemID),
            elem = $('#' + elemID + '> i').removeClass('fa-sort'),
            otherBtns = elem.parent().parent().children();
        for (var e of otherBtns) {
            e = $($(e).children()[0]);
            if (e.parent().attr('id') === elem.parent().attr('id') || e.parent().attr('id') == undefined) continue;
            e.removeClass('fa-arrow-down-a-z')
                .removeClass('fa-arrow-down-z-a')
                .addClass('fa-sort');
        }
        if (state == 'z-a' || !state) {
            elem.removeClass('fa-arrow-down-z-a').addClass('fa-arrow-down-a-z');
            return 'a-z';
        } else {
            elem.addClass('fa-arrow-down-z-a').removeClass('fa-arrow-down-a-z');
            return 'z-a';
        }
    }

}