var React = require('react');
var Modal = require('../Modal/Modal');
var ModalInner = require('../Modal/ModalInner');
var ModalText = require('../Modal/ModalText');
var ModalButtons = require('../Modal/ModalButtons');
var ModalButton = require('../Modal/ModalButton');
var ModalTitle = require('../Modal/ModalTitle');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            title: "温馨提示",
            cancelLabel: "取消",
            okLabel: "确定",
            cancelColor: 'red',
            okColor:'green'
        }
    },
    render: function() {
         return (
            <Modal>
                <ModalInner>
                    <ModalTitle>{this.props.title}</ModalTitle>
                    <ModalText>{this.props.text}</ModalText>
                </ModalInner>
                <ModalButtons>
                    <ModalButton style={{color:this.props.cancelColor}} onTap={this.props.cancelFunc}>{this.props.cancelLabel}</ModalButton>
                    <ModalButton style={{color:this.props.okColor}} onTap={this.props.okFunc}>{this.props.okLabel}</ModalButton>
                </ModalButtons>
            </Modal>
         );
    }
});
