import React from 'react';
import withStyles from 'nebo15-isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { reduxFormValidate } from 'react-nebo15-validate';

import { Confirm } from '@components/Popup';
import Form, { FormRow, FormBlock, FormButtons, FormColumn } from '@components/Form';
import Button, { ButtonsGroup } from '@components/Button';
import FieldCheckbox from '@components/reduxForm/FieldCheckbox';
import FieldInput from '@components/reduxForm/FieldInput';

import { Select } from '@components/Select';

import ConfirmFormChanges from 'containers/blocks/ConfirmFormChanges';

import styles from './styles.scss';

const getValues = getFormValues('settlement-form');

const settlement_type = {
  VILLAGE: 'село',
  TOWNSHIP: 'селище міського типу',
  SETTLEMENT: 'селище',
  CITY: 'місто',
};

@translate()
@withStyles(styles)
@reduxForm({
  form: 'settlement-form',
  validate: reduxFormValidate({
    settlement_name: {
      required: true,
    },
    koatuu: {
      required: true,
      numeric: true,
      maxLength: 10,
    },
    type: {
      required: true,
    },
  }),
})
@connect(state => ({
  values: getValues(state),
}))
export default class SettlementForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.state = {
      savedValues: props.initialValues,
      onDelete: false,
    };
  }
  onSubmit(values, ...args) {
    const { mountain_group } = values;

    const data = {
      ...values,
      mountain_group: Boolean(mountain_group),
    };

    return this.props.onSubmit(data, ...args).then((action) => {
      if (action.error) return action;
      this.setState({
        savedValues: values,
      });
      return action;
    });
  }
  onDelete() {
    return this.props.onDelete(this.state.savedValues.id);
  }
  get isChanged() {
    const { values = [] } = this.props;
    return JSON.stringify(values) !== JSON.stringify(this.state.savedValues);
  }
  render() {
    const { handleSubmit, submitting, onDelete, edit, t } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.onSubmit)}>
        <FormBlock>
          <FormRow>
            <FormColumn>
              <Field
                name="name"
                component={FieldInput}
                labelText={t('Settlement Name')}
              />
            </FormColumn>
            <FormColumn>
              <Field
                name="koatuu"
                component={FieldInput}
                labelText={t('Koatuu')}
                placeholder={t('1234567890')}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="type"
                labelText={t('settlement type')}
                component={Select}
                placeholder="Select settlement type"
                options={Object.keys(settlement_type).map(i => ({
                  name: i,
                  title: settlement_type[i],
                }))}
              />
            </FormColumn>
            <FormColumn>
              <div className={styles.checkbox}>
                <Field
                  labelText={t('mountain_group')}
                  name="mountain_group"
                  component={FieldCheckbox}
                />
              </div>
            </FormColumn>
          </FormRow>
        </FormBlock>
        <FormButtons>
          {
            edit && (<ButtonsGroup>
              <Button type="submit" disabled={!this.isChanged}>{
                submitting ? t('Saving...') : (this.isChanged ? t('Update Settlement') : t('Saved'))
              }</Button>
            </ButtonsGroup>)
          }
          {
            !edit && (<ButtonsGroup>
              <Button type="submit" disabled={!this.isChanged}>{
                submitting ? t('Saving...') : (this.isChanged ? t('Save New Settlement') : t('Saved'))
              }</Button>
            </ButtonsGroup>)
          }
        </FormButtons>
        <div className={styles.delimiter} />
        <ConfirmFormChanges submitting={submitting} isChanged={this.isChanged} />
        <Confirm
          title={t('Are you sure?')}
          active={this.state.onDelete}
          theme="error"
          confirm={t('Yes')}
          cancel={t('No')}
          id="confirm-delete"
          onCancel={() => this.setState({ onDelete: false })}
          onConfirm={() => onDelete(this.state.savedValues.id)}
        >{ t('Are you sure want to delete this settlement?') }</Confirm>
      </Form>
    );
  }
}
