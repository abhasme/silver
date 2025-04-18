"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageStatus = exports.Permissionstatus = exports.PermissionRole = void 0;
var PermissionRole;
(function (PermissionRole) {
    PermissionRole["ADMIN"] = "ADMIN";
    PermissionRole["CONTRIBUTOR"] = "ROTEX";
    PermissionRole["GUEST"] = "CP";
    PermissionRole["SP"] = "SP";
    PermissionRole["RO"] = "RO";
    PermissionRole["HO"] = "HO";
})(PermissionRole = exports.PermissionRole || (exports.PermissionRole = {}));
;
var Permissionstatus;
(function (Permissionstatus) {
    Permissionstatus["BLACK"] = "BLACK";
    Permissionstatus["RED"] = "RED";
    Permissionstatus["YELLOW"] = "YELLOW";
    Permissionstatus["GREEN"] = "GREEN";
    Permissionstatus["WEIGHT"] = "WHIGHT";
})(Permissionstatus = exports.Permissionstatus || (exports.Permissionstatus = {}));
;
var StageStatus;
(function (StageStatus) {
    StageStatus["ORDER_RECCOMENDATION"] = "ORDER_RECCOMENDATION";
    StageStatus["CP_ACCEPT"] = "CP_ACCEPT";
    StageStatus["CP_REJECT"] = "CP_REJECT";
    StageStatus["ROTEX_REJECT"] = "ROTEX_REJECT";
    StageStatus["ROTEX_ACCEPT"] = "ROTEX_ACCEPT";
    StageStatus["WIP"] = "WIP";
    StageStatus["IN_TRANSIT"] = "IN_TRANSIT";
    StageStatus["GRN"] = "GRN";
})(StageStatus = exports.StageStatus || (exports.StageStatus = {}));
//# sourceMappingURL=role.enum.js.map