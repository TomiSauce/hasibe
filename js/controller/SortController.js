class SortController {

    static setSortParam(elemID) {
        let key = elemID.replace('sort', '');
        let out = {
            order: SortView.switchButtonState(elemID),
            key: key.charAt(0).toLowerCase() + key.slice(1)
        };
        localStorage.setItem('sortBy', JSON.stringify(out));
        UserController.refreshTable();
        DataController.refresh();
    }

    static sortUsers(users) {
        let sortBy = JSON.parse(localStorage.getItem('sortBy'));
        let sorted = [];
        if (sortBy['order'] === 'a-z') {
            switch (sortBy['key']) {
                case 'rank':
                    sorted = users.sort((a, b) => a.get('rank').get('abbr').toLowerCase().localeCompare(b.get('rank').get('abbr').toLowerCase()));
                    break;
                case 'lastName':
                    sorted = users.sort((a, b) => a.get('lastName').toLowerCase().localeCompare(b.get('lastName').toLowerCase()));
                    break;
                case 'firstName':
                    sorted = users.sort((a, b) => a.get('firstName').toLowerCase().localeCompare(b.get('firstName').toLowerCase()));
                    break;
                case 'driver':
                    sorted = users.sort((a, b) => b.get('driver').localeCompare(a.get('driver')));
                    break;
                case 'flag':
                    sorted = users.sort((a, b) => a.get('flag').get('text').toLowerCase().localeCompare(b.get('flag').get('text').toLowerCase()));
                    break;
                case 'task':
                    sorted = users.sort((a, b) => a.get('task').get('name').toLowerCase().localeCompare(b.get('task').get('name').toLowerCase()));
                    break;
                case 'status':
                    sorted = users.sort((a, b) => {
                        if (a.get('timeRemaining') > b.get('timeRemaining')) return -1;
                        if (a.get('timeRemaining') < b.get('timeRemaining')) return 1;
                        return 0;
                    });
                    break;
            }
        } else {
            switch (sortBy['key']) {
                case 'rank':
                    sorted = users.sort((a, b) => b.get('rank').get('abbr').toLowerCase().localeCompare(a.get('rank').get('abbr').toLowerCase()));
                    break;
                case 'lastName':
                    sorted = users.sort((a, b) => b.get('lastName').toLowerCase().localeCompare(a.get('lastName').toLowerCase()));
                    break;
                case 'firstName':
                    sorted = users.sort((a, b) => b.get('firstName').toLowerCase().localeCompare(a.get('firstName').toLowerCase()));
                    break;
                case 'driver':
                    sorted = users.sort((a, b) => a.get('driver').localeCompare(b.get('driver')));
                    break;
                case 'flag':
                    sorted = users.sort((a, b) => b.get('flag').get('text').toLowerCase().localeCompare(a.get('flag').get('text').toLowerCase()));
                    break;
                case 'task':
                    sorted = users.sort((a, b) => b.get('task').get('name').toLowerCase().localeCompare(a.get('task').get('name').toLowerCase()));
                    break;
                case 'status':
                    sorted = users.sort((a, b) => {
                        if (b.get('timeRemaining') > a.get('timeRemaining')) return -1;
                        if (b.get('timeRemaining') < a.get('timeRemaining')) return 1;
                        return 0;
                    });
                    break;
            }
        }

        return sorted;
    }

}