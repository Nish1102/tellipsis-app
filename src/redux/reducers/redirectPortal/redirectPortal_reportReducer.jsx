import { ALL_REDIRECT_REPORT_FAIL, ALL_REDIRECT_REPORT_REQUEST, ALL_REDIRECT_REPORT_SUCCESS } from "../../constants/redirectPortal/redirectPortal_reportConstants"

export const getRedirectReportReducers = (state = { users: [] }, action) => {

    switch (action.type) {
        case ALL_REDIRECT_REPORT_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case ALL_REDIRECT_REPORT_SUCCESS:

            return {
                ...state,
                loading: false,
                RedirectReport: action.payload
            }
        case ALL_REDIRECT_REPORT_FAIL:

            return {
                ...state,
                loading: false,
                error: action.payload

            }

        default:
            return state
    }

}