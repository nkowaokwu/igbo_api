import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

const Email = ({ defaultValues, getValues, control }) => (
  <>
    <h2 className="form-header">Email</h2>
    <p className="mb-4">You will be sent email notifications concerning the status of your suggestion.</p>
    <Controller
      as={(
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          data-test="email-input"
        />
      )}
      name="email"
      control={control}
      defaultValue={defaultValues?.english || getValues().english}
    />
  </>
);

Email.propTypes = {
  defaultValues: PropTypes.objectOf(['email']),
  getValues: PropTypes.func,
  control: PropTypes.objectOf(['mode']),
};

Email.defaultProps = {
  defaultValues: { email: '' },
  getValues: () => {},
  control: null,
};

export default Email;
