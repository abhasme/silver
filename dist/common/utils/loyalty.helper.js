"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemeBasedOnScan = exports.dateFromFrequency = void 0;
async function dateFromFrequency(frequency) {
    var todayDate = new Date;
    var firstday = new Date().toISOString().split('T')[0];
    var lastday = new Date().toISOString().split('T')[0];
    switch (frequency) {
        case "daily":
            firstday = new Date().toISOString().split('T')[0];
            lastday = new Date().toISOString().split('T')[0];
            break;
        case "weekly":
            firstday = new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay())).toISOString().split('T')[0];
            lastday = new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay() + 6)).toISOString().split('T')[0];
            break;
        case "monthly":
            firstday = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1).toISOString().split('T')[0];
            lastday = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).toISOString().split('T')[0];
            break;
        default:
            firstday = new Date().toISOString().split('T')[0];
            lastday = new Date().toISOString().split('T')[0];
            break;
    }
    return { fromDate: firstday, toDate: lastday };
}
exports.dateFromFrequency = dateFromFrequency;
;
async function schemeBasedOnScan(basedOn, frequencypoints) {
    var data = 1;
    switch (basedOn) {
        case 'points':
            data = frequencypoints.points;
            break;
        default:
            data = frequencypoints.counts;
            break;
    }
    return data;
}
exports.schemeBasedOnScan = schemeBasedOnScan;
;
//# sourceMappingURL=loyalty.helper.js.map