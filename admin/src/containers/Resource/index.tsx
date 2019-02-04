import { connect } from "react-redux";
import { push } from "react-router-redux";
import { IStoreState } from "../../rootReducer";
import Resource from "../../components/Resource";
import { actions as toastrActions } from "react-redux-toastr";

const mapStateToProps = (state: IStoreState) => ({
  jwt: state.jwt,
  schema: state.schema,
  data: state.data,
  settings: state.settings
});

const dispatchToProps = {
  push,
  errorToastr: (message: string) =>
    toastrActions.add({
      message: message,
      options: { timeOut: 3000, showCloseButton: true },
      position: "top-center",
      title: "Error",
      type: "error"
    }),
  messageToastr: (message: string) =>
    toastrActions.add({
      message: message,
      options: { timeOut: 3000, showCloseButton: true },
      position: "top-center",
      title: "Message",
      type: "info"
    })
};

export default connect(mapStateToProps, dispatchToProps)(Resource);
