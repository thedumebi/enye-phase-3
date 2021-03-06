import axios from "axios";
import {
  REQUEST_CREATE_REQUEST,
  REQUEST_CREATE_SUCCESS,
  REQUEST_CREATE_FAIL,
  REQUEST_ACCEPT_REQUEST,
  REQUEST_ACCEPT_SUCCESS,
  REQUEST_ACCEPT_FAIL,
  REQUEST_DELETE_REQUEST,
  REQUEST_DELETE_SUCCESS,
  REQUEST_DELETE_FAIL,
  REQUEST_DETAILS_REQUEST,
  REQUEST_DETAILS_SUCCESS,
  REQUEST_DETAILS_FAIL,
  REQUEST_REJECT_REQUEST,
  REQUEST_REJECT_SUCCESS,
  REQUEST_REJECT_FAIL,
  REQUEST_UPDATE_REQUEST,
  REQUEST_UPDATE_SUCCESS,
  REQUEST_UPDATE_FAIL,
  RECEIVED_REQUEST_LIST_REQUEST,
  RECEIVED_REQUEST_LIST_SUCCESS,
  RECEIVED_REQUEST_LIST_FAIL,
  SENT_REQUEST_LIST_REQUEST,
  SENT_REQUEST_LIST_SUCCESS,
  SENT_REQUEST_LIST_FAIL,
} from "../constants/request.constants";
import { USER_LOGIN_SUCCESS } from "../constants/user.constants";
import { getUserDetails } from "./user.actions";

export const createRequest = (request) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/requests`, request, config);

    dispatch({
      type: REQUEST_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getSentRequests = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SENT_REQUEST_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/requests/sent", config);

    dispatch({ type: SENT_REQUEST_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SENT_REQUEST_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getReceivedRequests = () => async (dispatch, getState) => {
  try {
    dispatch({ type: RECEIVED_REQUEST_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/requests/received", config);

    dispatch({ type: RECEIVED_REQUEST_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RECEIVED_REQUEST_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getRequestDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/requests/${id}`, config);

    dispatch({ type: REQUEST_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REQUEST_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateRequest = (request) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(
      `/api/requests/${request._id}`,
      request,
      config
    );

    dispatch({ type: REQUEST_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REQUEST_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteRequest = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/requests/${id}`, config);

    dispatch({
      type: REQUEST_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const acceptRequest = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_ACCEPT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(
      `/api/requests/${id}/accept`,
      { id },
      config
    );

    dispatch({ type: REQUEST_ACCEPT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REQUEST_ACCEPT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const rejectRequest = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_REJECT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(
      `/api/requests/${id}/reject`,
      { id },
      config
    );

    dispatch({ type: REQUEST_REJECT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REQUEST_REJECT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
