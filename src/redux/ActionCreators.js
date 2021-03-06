import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';
import * as urlPath from '../shared/urlPaths';

export const toggleLoginModal = () => ({
   type: ActionTypes.TOGGLE_LOGIN_MODAL
});

export const toggleRegisterModal = () => ({
    type: ActionTypes.TOGGLE_REGISTER_MODAL
});

export const toggleResultModal = () => ({
    type: ActionTypes.TOGGLE_RESULT_MODAL
});

export const setAuthData = (data) => ({
    type: ActionTypes.SET_AUTH_DATA,
    payload: data
});

export const clearAuthData = (data) => ({
    type: ActionTypes.CLEAR_AUTH_DATA,
    payload: data
});

export const transactionsLoading = () => ({
   type: ActionTypes.TRANSACTIONS_LOADING
});

export const addTransactions = (transactions) => ({
   type: ActionTypes.ADD_TRANSACTIONS,
   payload: transactions
});

export const transactionsFailed = (errMess) => ({
   type: ActionTypes.TRANSACTIONS_FAILED,
   payload: errMess
});

export const fetchTransactions = () => (dispatch, getState) => {

    dispatch(transactionsLoading(true));

    const token = getState().auth.apiToken;

    let request = new Request(baseUrl + urlPath.transactions, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        })
    });

    return fetch(request)
        .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                let errMess = new Error(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(transactions => dispatch(addTransactions(transactions)))
        .catch(error => dispatch(transactionsFailed(error.message)));
};

export const accountsLoading = () => ({
    type: ActionTypes.ACCOUNTS_LOADING
});

export const addAccounts = (accounts) => ({
    type: ActionTypes.ADD_ACCOUNTS,
    payload: accounts
});

export const accountsFailed = (errMess) => ({
    type: ActionTypes.ACCOUNTS_FAILED,
    payload: errMess
});

export const fetchAccounts = () => (dispatch, getState) => {

    dispatch(accountsLoading());

    const token = getState().auth.apiToken;

    let request = new Request(baseUrl + urlPath.accounts, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        })
    });

    return fetch(request)
        .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                let errMess = new Error(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(accounts => dispatch(addAccounts(accounts)))
        .catch(error => dispatch(accountsFailed(error.message)));
};

export const userDataLoading = () => ({
    type: ActionTypes.USER_DATA_LOADING
});

export const addUserData = (userData) => ({
    type: ActionTypes.ADD_USER_DATA,
    payload: userData
});

export const userDataFailed = (errMess) => ({
    type: ActionTypes.USER_DATA_FAILED,
    payload: errMess
});

export const fetchUserData = () => (dispatch, getState) => {

    dispatch(userDataLoading());

    const token = getState().auth.apiToken;

    let request = new Request(baseUrl + urlPath.currentUser, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        })
    });

    return fetch(request)
        .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                throw new Error(error.message);
            })
        .then(response => response.json())
        .then(userData => dispatch(addUserData(userData)))
        .catch(error => dispatch(userDataFailed(error.message)));
};

export const initLogin = () => ({
    type: ActionTypes.LOGIN_STARTED
});

export const loginFailed = (errMess) => ({
    type: ActionTypes.LOGIN_FAILED,
    payload: errMess
});

export const initRegistration = () => ({
    type: ActionTypes.REGISTRATION_STARTED
});

export const registrationFailed = (errMess) => ({
    type: ActionTypes.REGISTRATION_FAILED,
    payload: errMess
});

export const handleLogin = (username, password) => (dispatch) => {

    dispatch(initLogin());

    fetch(baseUrl + urlPath.tokenAuth, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': password})
    }).then(response => {
            if (response.ok) {
                return response;
            } else {
                let error = new Error('Error' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            throw new Error(error.message);
        }).then(response => response.json()).then(json => {
        dispatch(setAuthData({'token': json.token, 'username': json.user.username, 'uuid': json.user.uuid}));
        dispatch(addUserData(json.user));
        dispatch(toggleLoginModal());
    }).catch(error => dispatch(loginFailed(error.message)));
};


export const handleRegistration = (username, password) => (dispatch) => {

    dispatch(initRegistration());

    return fetch(baseUrl + urlPath.users, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': password})
    }).then(response => {
            if (response.ok) {
                return response;
            } else {
                let error = new Error('Error' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            throw new Error(error.message);
        }).then(response => response.json()).then(user => {
        dispatch(setAuthData({'token': user.token, 'username': user.username, 'uuid': user.uuid}));
        dispatch(addUserData(user));
        dispatch(toggleRegisterModal());
    }).catch(error => dispatch(registrationFailed(error.message)));
};

export const initLogout = () => ({
    type: ActionTypes.LOGOUT_USER
});

export const handleLogout = () => (dispatch) => {
    dispatch(initLogout());
    dispatch(clearAuthData());
};

export const initTransfer = () => ({
    type: ActionTypes.TRANSFER_FUNDS
});

export const transferResult = (result) => ({
    type: ActionTypes.TRANSFER_RESULT,
    payload: result
});

export const transferFailed = (errMess) => ({
    type: ActionTypes.TRANSFER_FAILED,
    payload: errMess
});

export const transferFunds = (sender, receiver, amount) => (dispatch, getState) => {

    dispatch(initTransfer());

    const token = getState().auth.apiToken;

    return fetch(baseUrl + urlPath.transfer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        },
        body: JSON.stringify({
            'sender_account': sender,
            'receiver_account': receiver,
            'sent_amount': amount
        })
    }).then(response => {
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                throw new Error(error.message);
            }).then(response => response.json()).then(result => {
            dispatch(transferResult(result));
            dispatch(toggleResultModal());
        }).catch(error => dispatch(transferFailed(error.message)));

};