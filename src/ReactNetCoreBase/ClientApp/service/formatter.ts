import i18n from 'i18next';
import moment from 'moment';

export function formatBytes(bytes: number, decimals?: number) {
    if (bytes == 0) return '0 Byte';
    var k = 1000; // or 1024 for binary
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date: Date, format?: string) {
    return format ? moment(date).format(format) : moment(date).format();
}