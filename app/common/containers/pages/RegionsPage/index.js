import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { provideHooks } from 'redial';
import Helmet from 'react-helmet';
import { filterParams } from 'helpers/url';
import withStyles from 'nebo15-isomorphic-style-loader/lib/withStyles';

import { H1 } from '@components/Title';
import Table from '@components/Table';
import Button from '@components/Button';
import { FormRow, FormColumn } from '@components/Form';

import FieldFilterForm from 'containers/forms/FieldFilterForm';
// import Pagination from 'components/CursorPagination';

import { getRegions } from 'reducers';
import { fetchRegions } from './redux';

import styles from './styles.scss';

@withRouter
@withStyles(styles)
@translate()
@provideHooks({
  fetch: ({ dispatch, location: { query } }) =>
    dispatch(fetchRegions(query)),
})
@connect(state => ({
  ...state.pages.RegionsPage,
  regions: getRegions(state, state.pages.RegionsPage.regions),
}))
export default class RegionsPage extends React.Component {
  render() {
    const { regions = [], t, location } = this.props;

    return (
      <div id="roles-page">
        <Helmet title={t('Regions')} />
        <H1>{ t('Regions') }</H1>
        <FormRow>
          <FormColumn>
            <FieldFilterForm
              name="region"
              form="regions_name_form"
              defaultValue={{
                region: location.query.region,
              }}
              submitBtn
              onSubmit={name => filterParams(name, this.props)}
            />
          </FormColumn>
          <FormColumn />
        </FormRow>
        <div id="regions-table" className={styles.table}>
          <Table
            columns={[
              { key: 'id', title: t('Id') },
              { key: 'name', title: t('Name') },
              { key: 'koatuu', title: t('Koatuu') },
              { key: 'edit', title: t('Action') },
            ]}
            data={regions.map(item => ({
              ...item,
              name: (<div className={styles.name}>
                <Button
                  id={`edit-region-button-${item.id}`}
                  theme="link"
                  color="red"
                  to={`/districts?region=${item.name}`}
                >
                  {item.name}
                </Button>
              </div>),
              edit: (<Button
                id={`edit-region-button-${item.id}`}
                theme="link"
                to={`/regions/${item.id}`}
              >
                { t('Edit') }
              </Button>),
            }))}
          />
        </div>
        <div className={styles.block}>
          <Button to="/regions/create">{t('Create new region')}</Button>
        </div>

        {/* <div className={styles.pagination}>
          <Pagination
            location={location}
            more={paging.has_more}
            after={paging.cursors.starting_after}
            before={paging.cursors.ending_before}
          />
        </div> */}

      </div>
    );
  }
}
