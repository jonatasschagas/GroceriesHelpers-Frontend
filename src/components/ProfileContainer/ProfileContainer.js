import React from 'react';
import HelpForm from './HelpForm';
import './Profile.css'
import { Modal, Button } from 'react-materialize';
import GroceriesAPI from '../../api/GroceriesAPI';
import Profile from './Profile';
import HelpCardList from './HelpCardList/HelpCardList';
import UserAPI from '../../api/UserAPI';
import icon from '../Main/images//account (1).png';
import image from '../Main/images//papaya1.png';

// This wrapper prevents the Modal from re-rendering
// Modal component from react-materialize stops working if its re-rendered (setState)
class ModalWrapper extends React.Component {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (<>
            {this.props.children}
        </>);
    }

}

class ProfileContainer extends React.Component {

    state = {
        user: {},
        myGroceries: [],
        myGroceriesHelper: [],
        isCompletedModal: false,
        groceryToComplete: null
    }

    submitButtonDelegate = {}

    componentDidMount() {
        UserAPI.getUser(this.props.userId)
            .then((res) => {
                this.setState({
                    user: res.data
                });
            })
            .catch((err) => {
                return err;
            });
        GroceriesAPI.getMyGroceries()
            .then((res) => {
                this.setState({
                    myGroceries: res.data.myGroceries,
                    myGroceriesHelper: res.data.myGroceriesHelper
                })
            });
    }


    handleDelete = (grocery) => {
        GroceriesAPI.delete(grocery)
        .then(res => {
            let myGroceries = this.state.myGroceries.filter(grocery => {
                return grocery._id !== res.id;
            })
            this.setState({
                myGroceries
            })
        })
    }


    handleEdit = (user) => {
        UserAPI.update(user)
            .then(res => {
                this.setState({
                    user: res.data
                })
            })
    }


    onCompleteSelected = (groceryToComplete) => {
        this.setState({
            isCompletedModal: true,
            groceryToComplete: groceryToComplete
        });
    }

    onCompleteConfirmed = () => {
        GroceriesAPI.complete(this.state.groceryToComplete)
            .then((res) => {
                let updatedGrocery = res.data;
                let groceries = this.state.myGroceries;
                let groceryIndex = groceries.findIndex(gro => gro._id === updatedGrocery._id);
                groceries[groceryIndex] = updatedGrocery;
                this.setState({ myGroceries: groceries, groceryToComplete: null, isCompletedModal: false });
            });
    }

    onCompleteCanceled = () => {
        this.setState({ groceryToComplete: null, isCompletedModal: false });
    }


    saveRequest = (newRequest) => {
        GroceriesAPI.create(newRequest)
            .then(res => {
                let createdRequest = res.data;
                let myGroceries = this.state.myGroceries;
                myGroceries.push(createdRequest);
                this.setState({ myGroceries: myGroceries });
                this.submitButtonDelegate.clearHelpForm();
            });
    }

    // this method is a wrapper for the method onSubmitHelpForm from the HelpForm Component
    // For the Modal component to work properly, it needs to be defined outside
    // the HelpForm component. Since the buttons are defined outside the HelpForm component
    // we need to use an object to act as "delegate" to call the onSubmit from the HelpForm
    onSubmit = () => {
        if (this.submitButtonDelegate.onSubmit) {
            this.submitButtonDelegate.onSubmit();
        }
    }

    render() {

        return (
            <>
                {/* User profile background */}
                <div className="row">
                    <div className="col s12">
                        <div id="helpFormRoot" className="container">
                            <div id="profile-page-header" className="card">
                                <div className="card-image waves-effect waves-block waves-light">
                                    <img className="activator" src={image} alt="user background" />
                                    <h3>Welcome, {this.state.user.firstName}</h3>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col s12">
                        <div className="container">
                            {/* User requests */}
                            <Profile
                                user={this.state.user}
                                handleEdit={this.handleEdit}
                            />
                        </div>
                    </div>


                </div>


                {/* Modal */}
                <div className="row">
                    <div className="col s12">
                        <div className="container">
                            {/* Modal needs to stay around the HelpForm, because it can be rendered (initialized) only once. If we define the Modal inside the HelpForm, every time we call setState on the HelpForm the Modal will be recreated and will no longer work properly (bug from react-materialize) */}
                            <ModalWrapper>
                                <Modal
                                    actions={[
                                        <Button flat modal="close" node="button" waves="green">Cancel</Button>,
                                        <Button flat modal="close" node="button" onClick={this.onSubmit} waves="green">Submit</Button>
                                    ]}
                                    bottomSheet={false}
                                    fixedFooter={false}
                                    header="Add a new request"
                                    open={false}
                                    options={{ dismissible: false }}
                                    root={document.getElementById('root')}
                                    trigger={<Button className="addRequestBtn" node="button">Add new request</Button>}
                                >
                                    <HelpForm submitButtonDelegate={this.submitButtonDelegate} saveRequest={this.saveRequest} />
                                </Modal>
                            </ModalWrapper>

                        </div>

                    </div>
                </div>



                <div className="row">
                    <div className="col s12">
                        <div className="container">
                            {/* About user */}
                            <HelpCardList
                                user={this.state.user}
                                myGroceries={this.state.myGroceries}
                                myGroceriesHelper={this.state.myGroceriesHelper}
                                onCompleteSelected={this.onCompleteSelected}
                                handleDelete={this.handleDelete}
                            />
                        </div>
                    </div>
                </div>
                {this.state.isCompletedModal &&

                    <ModalWrapper>
                        <Modal
                            actions={[
                                <Button flat modal="close" node="button" onClick={this.onCompleteCanceled} waves="green">Cancel</Button>,
                                <Button flat modal="close" node="button" onClick={this.onCompleteConfirmed} waves="green">Complete</Button>
                            ]}
                            bottomSheet={false}
                            fixedFooter={false}
                            header="Are you sure?"
                            open={true}
                            options={{ dismissible: false }}
                            root={document.getElementById('root')}
                        >
                            Are you sure you want to complete: {this.state.groceryToComplete.groceries}

                        </Modal>
                    </ModalWrapper>
                }

            </>
        )
    }
}

export default ProfileContainer;
