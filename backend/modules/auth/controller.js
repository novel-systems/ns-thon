const { ManagementClient } = require('auth0')
const Shared = require('@novel-systems/shared')

const AuthConstants = Shared.Auth
const axios = require('axios')
const _ = require('lodash')

/* Auth0 management api config */
const auth0 = new ManagementClient({
    domain: global.gConfig.AUTH0_DOMAIN,
    clientId: global.gConfig.AUTH0_CLIENT_ID,
    clientSecret: global.gConfig.AUTH0_CLIENT_SECRET,
})

const controller = {}

function getAuthorizationToken() {
    const options = {
        method: 'POST',
        url: `https://${global.gConfig.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            grant_type: 'client_credentials',
            client_id: global.gConfig.AUTH0_CLIENT_ID,
            client_secret: global.gConfig.AUTH0_CLIENT_SECRET,
            audience: 'urn:auth0-authz-api',
        },
    }

    return new Promise((resolve, reject) => {
        axios(options)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function config(accessToken) {
    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }
}

function getRoles(accessToken) {
    return axios
        .get(
            `${global.gConfig.AUTH0_AUTHORIZATION_EXTENSION_URL}/roles`,
            config(accessToken),
        )
        .then(res => res.data.roles)
}

function getRoleByName(accessToken, role) {
    return getRoles(accessToken).then(roles => {
        return _.find(roles, r => r.name === role)
    })
}

function assignRole(accessToken, userId, roleId) {
    return axios
        .patch(
            `${global.gConfig.AUTH0_AUTHORIZATION_EXTENSION_URL}/users/${userId}/roles`,
            [roleId],
            config(accessToken),
        )
        .then(res => res.data)
}

function removeRole(accessToken, userId, roleId) {
    return axios
        .delete(
            `${global.gConfig.AUTH0_AUTHORIZATION_EXTENSION_URL}/users/${userId}/roles`,
            {
                ...config(accessToken),
                data: [roleId],
            },
        )
        .then(res => res.data)
}

controller.grantAssistantOrganiser = async userId => {
    const { accessToken } = await getAuthorizationToken()
    const role = await getRoleByName(
        accessToken,
        AuthConstants.Roles.ASSISTANT_ORGANISER,
    )
    return assignRole(accessToken, userId, role._id)
}

controller.revokeAssistantOrganiser = async userId => {
    const { accessToken } = await getAuthorizationToken()
    const role = await getRoleByName(
        accessToken,
        AuthConstants.Roles.ASSISTANT_ORGANISER,
    )
    return removeRole(accessToken, userId, role._id)
}

controller.grantRecruiterPermission = async userId => {
    const { accessToken } = await getAuthorizationToken()
    const role = await getRoleByName(accessToken, AuthConstants.Roles.RECRUITER)
    return assignRole(accessToken, userId, role._id)
}

controller.revokeRecruiterPermission = async userId => {
    const { accessToken } = await getAuthorizationToken()
    const role = await getRoleByName(accessToken, AuthConstants.Roles.RECRUITER)
    return removeRole(accessToken, userId, role._id)
}

controller.updateMetadata = async (userId, updates) => {
    const user = await auth0.users.get({ id: userId })
    const metadata = { ...user.data.user_metadata, ...updates }
    const updatedUser = await auth0.users.update(
        { id: userId },
        { user_metadata: metadata },
    )
    return updatedUser
}

controller.deleteUser = async userId => {
    const deletedUser = await auth0.users.delete({ id: userId })
    return deletedUser
}

module.exports = controller
