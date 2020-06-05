import React from 'react';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, FormText, FormFeedback, Input, Label, Button } from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { isNil } from 'lodash';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const getMaxErrorMessage = (propertyName, maxLength, type) => {
    return `${propertyName} can be a max of ${maxLength} ${type === 'string' ? 'characters' : 'numbers'}`;
}

const loginInfoSchema = Yup.object().shape({
    username: Yup.string().max(50, getMaxErrorMessage('Username', 50, 'string')),
    currentPassword: Yup.string().max(50, getMaxErrorMessage('Current Password', 50, 'string')),
    newPassword: Yup.string().max(50, getMaxErrorMessage('New Password', 50, 'string'))
        .when('currentPassword', {
            is: (currentPassword) => currentPassword !== '',
            then: Yup.string().required('Required')
        }),
    confirmPassword: Yup.string().max(50, getMaxErrorMessage('Confirm Password', 50, 'string'))
        .when('currentPassword', {
            is: (currentPassword) => currentPassword !== '',
            then: Yup.string().required('Required')
        })
});

const validate = (values) => {
    let errors = {};

    return loginInfoSchema.validate(values, {
        abortEarly: false
    })
    .then(values => {
        if(!currentPasswordIsBlank(values.currentPassword) 
            && values.newPassword !== values.confirmPassword) {

            throw {
                inner: [],
                path: 'newPassword',
                message: 'Passwords do not match!'
            };
        }

        return {};
    })
    .catch(error => {
        const { inner, path, message } = error;

        if(inner.length > 0) {
            inner.forEach(innerError => {
                errors[innerError.path] = innerError.message;
            });
        } else {
            errors[path] = message;
        }
       
        throw errors;
    });
}

const handleCurrentPasswordChange = (setFieldValue, currentPasswordValue) => {
    if(currentPasswordIsBlank(currentPasswordValue)) {
        setFieldValue('newPassword', '');
        setFieldValue('confirmPassword', '');
    }

    setFieldValue('currentPassword', currentPasswordValue);
}

const currentPasswordIsBlank = (currentPassword) => currentPassword === '';

const saveButtonDisabled = values => {
    let result = false;

    const valueKeys = Object.keys(values);
    
    for(let i = 0; i < valueKeys.length; i++) {
        if(isNil(values[valueKeys[i]])) {
            result = true;
            break;
        }
    }

    return result;
}

const LoginInfoModal = props => {
    const { 
        isOpen, 
        toggle,
        removeLoginInfoError, 
        username, 
        saveLoginInfo, 
        error
     } = props;

    let errorText;

    if(error) {
        errorText = <Alert color="danger">{error}</Alert>;
    }

    return (
        <Modal isOpen={isOpen}>
            <Formik 
                enableReinitialize={false}
                initialValues={{
                        username: '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                }}
                onSubmit={values => {
                    var loginInfoRequest = {
                        oldUsername: username,
                        newUsername: values.username,
                        oldPassword: values.currentPassword,
                        newPassword: values.newPassword
                    };

                    saveLoginInfo(loginInfoRequest);
                }}
                validate={validate}
            >
                {({             
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    handleChange,
                    setFieldValue
                }) => (
                        <div>
                            <ModalHeader>
                                Change Login Info
                            </ModalHeader>
                                
                            <ModalBody>
                                <Form onSubmit={handleSubmit}>

                                    {errorText}

                                    <FormGroup>
                                        <Label for="username">Username</Label>
                                        <Input 
                                            type="text"
                                            name="username"
                                            value={values.username}
                                            onChange={handleChange}
                                            invalid={errors.username && touched.username}
                                        />
                                        {
                                            errors.username 
                                            && touched.username 
                                            && <FormFeedback>{errors.username}</FormFeedback>
                                        }
                                        <FormText>Leave blank if you don't want to change your username</FormText>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="currentPassword">Current Password</Label>
                                        <Input 
                                            type="password"
                                            name="currentPassword"
                                            value={values.currentPassword}
                                            onChange={e => handleCurrentPasswordChange(setFieldValue, e.target.value)}
                                            invalid={errors.currentPassword && touched.currentPassword}
                                        />
                                        {
                                            errors.currentPassword 
                                            && touched.currentPassword
                                            && <FormFeedback>{errors.currentPassword}</FormFeedback>
                                        }
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="newPassword">New Password</Label>
                                        <Input 
                                            type="password"
                                            name="newPassword"
                                            value={values.newPassword}
                                            onChange={handleChange}
                                            invalid={errors.newPassword && touched.newPassword}
                                            disabled={currentPasswordIsBlank(values.currentPassword)}
                                        />
                                        {
                                            errors.newPassword
                                            && touched.newPassword
                                            && <FormFeedback>{errors.newPassword}</FormFeedback>
                                        }
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="confirmPassword">Confirm Password</Label>
                                        <Input 
                                            type="password"
                                            name="confirmPassword"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            invalid={errors.confirmPassword && touched.confirmPassword}
                                            disabled={currentPasswordIsBlank(values.currentPassword)}
                                        />
                                        {
                                            errors.confirmPassword 
                                            && touched.confirmPassword
                                            && <FormFeedback>{errors.confirmPassword}</FormFeedback>
                                        }
                                    </FormGroup>
                                </Form>
                            </ModalBody>

                            <ModalFooter>
                                <Button 
                                    color="primary" 
                                    onClick={handleSubmit} 
                                    disabled={values.username === '' &&  values.currentPassword === '' && values.newPassword === '' && values.confirmPassword === ''}
                                >
                                   Save
                                </Button>
                                <Button 
                                    color="secondary" 
                                    onClick={() => {
                                        if(error) {
                                            removeLoginInfoError();
                                        } else {
                                            toggle();
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </div>
                    )}
            </Formik>
        </Modal>
    )
}

export default LoginInfoModal;