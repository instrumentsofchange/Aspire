export const Roles = Object.freeze({
    admin: 'Admin',
    director: 'Director',
    student: 'Student'
});

// export const Roles = Object.freeze({
//     admin: 'ADMIN',
//     director: 'DIRECTOR',
//     student: 'STUDENT'
// });

export const convertRoleValueToEnum = (serverRoleId) => {
    let result;

    switch(serverRoleId) {
        case 0:
            result = Roles.admin;
            break;

        case 1:
            result = Roles.director;
            break;

        case 2:
            result = Roles.student;
            break;

        default:
            result = serverRoleId;
            break;
    }

    return result;
}

export const convertEnumToRoleValue = (enumValue) => {
    let result;

    switch(enumValue) {
        case Roles.admin:
            result = 0;
            break;

        case Roles.director:
            result = 1;
            break;

        case Roles.student:
            result = 2;
            break;

        default:
            result = enumValue;
            break;
    }

    return result;
}