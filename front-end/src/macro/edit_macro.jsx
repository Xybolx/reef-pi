import React from 'react'
import PropTypes from 'prop-types'
import { ErrorFor, ShowError } from '../utils/validation_helper'
import { showError } from 'utils/alert'
import classNames from 'classnames'
import i18n from 'utils/i18n'
import { Field, FieldArray } from 'formik'
import StepSelector from './step_selector'
import SelectType from './select_type'
import BooleanSelect from '../ui_components/boolean_select'

const EditMacro = ({
  values,
  errors,
  touched,
  submitForm,
  isValid,
  onBlur,
  handleChange,
  setFieldValue,
  dirty,
  readOnly
}) => {
  const handleSubmit = event => {
    event.preventDefault()

    if (dirty === false || isValid === true) {
      submitForm()
    } else {
      submitForm() // Calling submit form in order to show validation errors
      showError(i18n.t('validation:error'))
    }
  }

  const nosteps = (len) => {
    if (len < 1) { return (<div className='alert text-danger'> {i18n.t('none')}</div>) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='row'>
        <div className='col-12 col-sm-6 col-md-3'>
          <div className='form-group'>
            <label htmlFor='name'>{i18n.t('name')}</label>
            <Field
              name='name'
              disabled={readOnly}
              className={classNames('form-control', {
                'is-invalid': ShowError('name', touched, errors)
              })}
            />
            <ErrorFor errors={errors} touched={touched} name='name' />
          </div>
        </div>
        <div className='col-12 col-sm-6 col-md-3'>
          <div className='form-group'>
            <label htmlFor='name'>{i18n.t('macro:reversible')}</label>
            <Field
              name='reversible'
              component={BooleanSelect}
              disabled={readOnly}
              className={classNames('form-control', {
                'is-invalid': ShowError('reversible', touched, errors)
              })}
            >
              <option value='' className='d-none'>-- {i18n.t('select')} --</option>
              <option value='true'>{i18n.t('yes')}</option>
              <option value='false'>{i18n.t('no')}</option>
            </Field>
            <ErrorFor errors={errors} touched={touched} name='reversible' />
          </div>
        </div>

      </div>

      <div className='form-group'>
        <h6>{i18n.t('macro:steps')}</h6>
        <input className='d-none form-control is-invalid' />
        <ErrorFor errors={errors} touched={touched} name='steps' />
      </div>

      <FieldArray
        name='steps'
        render={arrayHelpers => {
          return (
            <div className='ml-2'>
              {nosteps(values.steps.length)}
              {values.steps.map((step, index) => {
                return (
                  <div className='row macro-step' name={`step-${index}`} key={index}>
                    <div className='col-12 col-sm-4 col-md-3'>
                      <SelectType
                        name={`steps.${index}.type`}
                        aria-label='Step Type'
                        title='Step Type'
                        className={classNames('form-control custom-select', {
                          'is-invalid': ShowError(`steps.${index}.type`, touched, errors)
                        })}
                        readOnly={readOnly}
                      />
                      <ErrorFor errors={errors} touched={touched} name={`steps.${index}.type`} />
                    </div>
                    <StepSelector
                      type={step.type}
                      name={`steps.${index}`}
                      errors={errors}
                      touched={touched}
                      readOnly={readOnly}
                    />

                    <div className={classNames('col-12 col-sm-1 col-md-3 ml-auto', { 'd-none': readOnly })}>
                      <button
                        aria-label={i18n.t('delete')}
                        title={i18n.t('delete')}
                        name={`remove-step-${index}`}
                        type='button'
                        className='btn btn-outline-danger'
                        onClick={() => arrayHelpers.remove(index)}
                        disabled={readOnly}
                      >
                        X
                      </button>
                    </div>
                  </div>
                )
              })}
              <div className={classNames('row', { 'd-none': readOnly })}>
                <div className='col-12'>
                  <button
                    type='button'
                    className='btn btn-outline-success float-right'
                    value='+'
                    onClick={() => arrayHelpers.push({ duration: '', id: '', on: '', title: '', message: '' })}
                    id='add-step'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        }}
      />

      <div className={classNames('row', { 'd-none': readOnly })}>
        <div className='col-12'>
          <input
            type='submit'
            value={i18n.t('save')}
            disabled={readOnly}
            className='btn btn-sm btn-primary float-right mt-1'
          />
        </div>
      </div>
    </form>
  )
}

EditMacro.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleBlur: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  handleChange: PropTypes.func
}

export default EditMacro
