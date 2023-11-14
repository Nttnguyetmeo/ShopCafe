'use strict';

/* eslint-disable require-jsdoc */
/* eslint-env jquery */
/* global moment, tui, chance */
/* global findCalendar, CalendarList, ScheduleList, generateSchedule */

(function(window, Calendar) {
    var cal, resizeThrottled;
    var useCreationPopup = false;
    var useDetailPopup = false;
    var datePicker, selectedCalendar;

    cal = new Calendar('#calendar', {
        defaultView: 'week',
        useCreationPopup: useCreationPopup,
        useDetailPopup: useDetailPopup,
        taskView: false/* ['time']*/,// khong lay task, mili
        disableDblClick: true,// khong cho tao detail bang double click
        disableClick: true,// khong cho tao detail bang  click
        calendars: CalendarList,
        usageStatistics:false,
        template: {
            milestone: function(model) {
                return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + model.bgColor + '">' + model.title + '</span>';
            },
            allday: function(schedule) {
                return getTimeTemplate(schedule, true);
            },
            //time: function(schedule) {
            //    return getTimeTemplate(schedule, true);
            //   // return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.raw.memo;
            //},
            time: function (schedule) {
                return '<span style="display: block;padding-left: 5px;font-size: 11px;font-weight: 400;background-color:'
                    + schedule.bgColor
                    + ';color:'
                    + schedule.color
                    +'">'
                    + moment(schedule.start.getTime()).format('HH:mm')
                    + ' '
                    //+ viewName
                    + schedule.title
                    + '</span>';


                //return '<strong>' + moment(schedule.start.getTime()).format('HH:mm') + '</strong>'
                //    + '<span style="background-color:' + schedule.bgColor + '">'
                //    + schedule.title + '</span>';
            },
            monthMoreClose: function () {
                return '<span class="tui-full-calendar-icon tui-full-calendar-ic-close"></span>';
            },
            monthMoreTitleDate: function (date, dayname) {
                var day = date.split('.')[2];
                return '<span class="tui-full-calendar-month-more-title-day">' + day + '</span> <span class="tui-full-calendar-month-more-title-day-label">' + dayname + '</span>';
            },
            monthGridHeader: function (dayModel) {
                var date = parseInt(dayModel.date.split('-')[2], 10);
                var classNames = ['tui-full-calendar-weekday-grid-date '];

                if (dayModel.isToday) {
                    classNames.push('tui-full-calendar-weekday-grid-date-decorator');
                }

                return '<span class="' + classNames.join(' ') + '">' + date + '</span>';
            },
        },
        month: {
            //moreLayerSize: {
            //    height: 'auto'
            //},
            //grid: {
            //    header: {
            //        header: 34
            //    },
            //    footer: {
            //        height: 10
            //    }
            //},
            //narrowWeekend: true,
            startDayOfWeek: 1, // monday
            //visibleWeeksCount: 3,
            //visibleScheduleCount: 4
        },
        week: {
            //narrowWeekend: true,
            startDayOfWeek: 1, // monday
            hourStart: 6,
            hourEnd: 22
        },
        day: {
            hourStart: 6,
            hourEnd: 22
        }
    });

    // event handlers
    //cal.on({
    //    'clickMore': function(e) {
    //        console.log('clickMore', e);
    //    },
    //    'clickSchedule': function(e) {
    //        console.log('clickSchedule', e);
    //    },
    //    'clickDayname': function(date) {
    //        console.log('clickDayname', date);
    //    },
    //    'beforeCreateSchedule': function(e) {
    //        console.log('beforeCreateSchedule', e);
    //        saveNewSchedule(e);
    //    },
    //    'beforeUpdateSchedule': function(e) {
    //        console.log('beforeUpdateSchedule', e);
    //        e.schedule.start = e.start;
    //        e.schedule.end = e.end;
    //        cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
    //    },
    //    'beforeDeleteSchedule': function(e) {
    //        console.log('beforeDeleteSchedule', e);
    //        cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
    //    },
    //    'afterRenderSchedule': function(e) {
    //        var schedule = e.schedule;
    //        // var element = cal.getElement(schedule.id, schedule.calendarId);
    //        // console.log('afterRenderSchedule', element);
    //    },
    //    'clickTimezonesCollapseBtn': function(timezonesCollapsed) {
    //        console.log('timezonesCollapsed', timezonesCollapsed);

    //        if (timezonesCollapsed) {
    //            cal.setTheme({
    //                'week.daygridLeft.width': '77px',
    //                'week.timegridLeft.width': '77px'
    //            });
    //        } else {
    //            cal.setTheme({
    //                'week.daygridLeft.width': '60px',
    //                'week.timegridLeft.width': '60px'
    //            });
    //        }

    //        return true;
    //    }
    //});

    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
   
        //var html = [];
        //var start = moment(schedule.start.toUTCString());
        //if (!isAllDay) {
        //    html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        //}
        //if (schedule.isPrivate) {
        //    html.push('<span class="calendar-font-icon ic-lock-b"></span>');
        //    html.push(' Private');
        //} else {
        //    if (schedule.isReadOnly) {
        //        html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
        //    } else if (schedule.recurrenceRule) {
        //        html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
        //    } else if (schedule.attendees.length) {
        //        html.push('<span class="calendar-font-icon ic-user-b"></span>');
        //    }
        //    else if (schedule.location) {
        //        html.push('<span class="calendar-font-icon ic-location-b"></span>');
        //    }
        //    html.push(' ' + schedule.title);
        //}

        //return html.join('');
        var html = [];
        var start = moment(schedule.start.toUTCString());
        html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        html.push('<span class="calendar-font-icon ic-user-b"></span>');
        html.push(' ' + schedule.title);
   

        return html.join('');
    }

    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';
        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        setRenderRangeText();
        setSchedules();
    }

    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
        setSchedules();
    }

    function onNewSchedule() {
        var title = $('#new-schedule-title').val();
        var location = $('#new-schedule-location').val();
        var isAllDay = document.getElementById('new-schedule-allday').checked;
        var start = datePicker.getStartDate();
        var end = datePicker.getEndDate();
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

        if (!title) {
            return;
        }

        cal.createSchedules([{
            id: String(chance.guid()),
            calendarId: calendar.id,
            title: title,
            isAllDay: isAllDay,
            start: start,
            end: end,
            category: isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            raw: {
                location: location
            },
            state: 'Busy'
        }]);

        $('#modal-new-schedule').modal('hide');
    }

    function onChangeNewScheduleCalendar(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var calendarId = getDataAction(target);
        changeNewScheduleCalendar(calendarId);
    }

    function changeNewScheduleCalendar(calendarId) {
        var calendarNameElement = document.getElementById('calendarName');
        var calendar = findCalendar(calendarId);
        var html = [];

        html.push('<span class="calendar-bar" style="background-color: ' + calendar.bgColor + '; border-color:' + calendar.borderColor + ';"></span>');
        html.push('<span class="calendar-name">' + calendar.name + '</span>');

        calendarNameElement.innerHTML = html.join('');

        selectedCalendar = calendar;
    }

    function createNewSchedule(event) {
        var start = event.start ? new Date(event.start.getTime()) : new Date();
        var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

        if (useCreationPopup) {
            cal.openCreationPopup({
                start: start,
                end: end
            });
        }
    }
    function saveNewSchedule(scheduleData) {
        var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
        var schedule = {
            id: String(chance.guid()),
            title: scheduleData.title,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start,
            end: scheduleData.end,
            category: scheduleData.isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            location: scheduleData.location,
            raw: {
                class: scheduleData.raw['class']
            },
            state: scheduleData.state
        };
        if (calendar) {
            schedule.calendarId = calendar.id;
            schedule.color = calendar.color;
            schedule.bgColor = calendar.bgColor;
            schedule.borderColor = calendar.borderColor;
        }

        cal.createSchedules([schedule]);

        refreshScheduleVisibility();
    }

    function onChangeCalendars(e) {      
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function(input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            CalendarList.forEach(function(calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function(input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility();
    }

    

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 3) {
            type = '3 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else {
            type = 'Monthly';
            iconClassName = 'calendar-icon ic_view_month';
        }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;
    }

    function setRenderRangeText() {
        var renderRange = document.getElementById('renderRange');
        var options = cal.getOptions();
        var viewName = cal.getViewName();
        var html = [];
        if (viewName === 'day') {
            html.push(moment(cal.getDate().getTime()).format('DD-MM-YYYY'));
        } else if (viewName === 'month' &&
            (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
            html.push(moment(cal.getDate().getTime()).format('MM-YYYY'));
        } else {
            html.push(moment(cal.getDateRangeStart().getTime()).format('DD-MM-YYYY'));
            html.push('  ~  ');
            html.push(moment(cal.getDateRangeEnd().getTime()).format(' DD-MM'));
        }
        renderRange.innerHTML = html.join('');
    }

    function setSchedules() {
        //cal.clear();
        //generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
        //cal.createSchedules(ScheduleList);
         //var schedules = [
         //    {
         //        id: 489273
         //        , title: 'Workout for 2019-04-05'
         //        , isAllDay: false
         //        , start: '2019-07-29T11:30:00+09:00'
         //        , end: '2019-07-29T12:00:00+09:00'
         //        , goingDuration: 30
         //        , comingDuration: 30
         //        , color: '#ffffff'
         //        , isVisible: true
         //        , bgColor: '#69BB2D'
         //        , dragBgColor: '#69BB2D'
         //        , borderColor: '#69BB2D'
         //        , calendarId: '1'
         //        , category: 'time'
         //        , dueDateClass: ''
         //        , customStyle: 'cursor: default;'
         //        , isPending: false
         //        , isFocused: false
         //        , isReadOnly: true
         //        , isPrivate: false
         //        , location: ''
         //        , attendees: ''
         //        , recurrenceRule: ''
         //        , state: ''
         //    },
         //    {
         //        id: 18073
         //        , title: 'completed with blocks'
         //        , isAllDay: false
         //        , start: '2019-07-29T09:00:00+09:00'
         //        , end: '2019-07-29T10:00:00+09:00'
         //        , goingDuration: 30
         //        , comingDuration: 30
         //        , color: '#ffffff'
         //        , isVisible: true
         //        , bgColor: '#54B8CC'
         //        , dragBgColor: '#54B8CC'
         //        , borderColor: '#54B8CC'
         //        , calendarId: '2'
         //        , category: 'time'
         //        //, dueDateClass: ''
         //        //, customStyle: ''
         //        //, isPending: false
         //        //, isFocused: false
         //        //, isReadOnly: false
         //        //, isPrivate: false
         //        //, location: ''
         //        //, attendees: ''
         //        //, recurrenceRule: ''
         //        //, state: ''
         //    }
         //];
         //cal.createSchedules(schedules);
        refreshScheduleVisibility();
    }

    function setEventListener() {
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
        $('#lnb-calendars').on('change', onChangeCalendars);

        $('#btn-save-schedule').on('click', onNewSchedule);
        $('#btn-new-schedule').on('click', createNewSchedule);

        $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);

        window.addEventListener('resize', resizeThrottled);
    }

    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    resizeThrottled = tui.util.throttle(function() {
        cal.render();
    }, 50);

    window.cal = cal;

    setDropdownCalendarType();
    setRenderRangeText();
    setSchedules();
    setEventListener();
})(window, tui.Calendar);

// set calendars
(function() {
    var calendarList = document.getElementById('calendarList');
    var html = [];
    CalendarList.forEach(function(calendar) {
        html.push('<div class="lnb-calendars-item"><label>' +
            '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
            '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
            '<span>' + calendar.name + '</span>' +
            '</label></div>'
        );
    });
    if (calendarList != undefined) calendarList.innerHTML = html.join('\n');
})();

function hexToRGBA(hex) {
    var radix = 16;
    var r = parseInt(hex.slice(1, 3), radix),
        g = parseInt(hex.slice(3, 5), radix),
        b = parseInt(hex.slice(5, 7), radix),
        a = parseInt(hex.slice(7, 9), radix) / 255 || 1;
    var rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

    return rgba;
}
function findCalendar(id) {
    var found;

    CalendarList.forEach(function (calendar) {
        if (calendar.id === id) {
            found = calendar;
        }
    });

    return found || CalendarList[0];
}
//function addCalendar(calendar) {
//    CalendarList.push(calendar);
//}
