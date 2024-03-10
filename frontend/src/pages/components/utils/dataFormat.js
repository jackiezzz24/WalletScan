import moment from 'moment'

export const dateFormat = (date) => {
    return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
  };
  