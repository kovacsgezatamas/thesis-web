import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Box } from 'rebass';
import axios from 'axios';
import reject from 'lodash/reject';

import Button from '@thesis-ui/button';
import Backdrop from '@thesis-ui/backdrop';
// import Spinner from '@thesis-ui/spinner';
import TextField, { TextFieldAddition } from '@thesis-ui/text-field';
// import Checkbox from '@thesis-ui/checkbox';
import Modal, { ModalHeader, ModalFooter } from '@thesis-ui/modal';
import { spacing, color, fontSize, fontWeight } from '@thesis-ui/tokens';

const BASE_URL = 'http://localhost:8099/api/';
const ENDPOINT = {
  subscriptions: `${BASE_URL}subscriptions`,
  cars: subscriptionId => `${BASE_URL}cars/subscription/${subscriptionId}`,
  createCar: subscriptionId => `${BASE_URL}cars/subscription/${subscriptionId}`,
  deleteCar: carVIN => `${BASE_URL}cars/${carVIN}`,
};

const extractIdentifier = value => {
  const idArray = (value?.value || '').split('/');
  return idArray[idArray.length - 1];
}

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(undefined);
  const [cars, setCars] = useState([]);

  const [carVINToDelete, setCarVINTonDelete] = useState(undefined);

  const [newCarVIN, setNewCarVIN] = useState('');
  const [newCarLicensePlate, setNewCarLicensePlate] = useState('');
  const [newCarMake, setNewCarMake] = useState('');
  const [newCarModel, setNewCarModel] = useState('');
  // const [newCarIsSuspended, setNewCarIsSuspended] = useState(true);
  // const [newCarCreatedAt, setNewCarCreatedAt] = useState(null);

  const { t } = useTranslation();

  async function onFetchSubscriptionsClick() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setSelectedSubscriptionId(undefined);
    setSubscriptions([]);
    setCars([]);

    try {
      const response = await axios.get(ENDPOINT.subscriptions);

      if (!response?.data) {
        throw new Error(`no data from ${ENDPOINT.subscriptions}`);
      }

      const subscriptionData = (response.data?.results?.bindings || []).map(({ id, isPerson, name }) => {
        return {
          id: extractIdentifier(id),
          isPerson: isPerson?.value === 'true',
          name: name?.value,
        }
      });

      setSubscriptions(subscriptionData);

    } catch (e) {
      window.alert(t('NO_SUBSCRIPTIONS_TO_SHOW'))
    }

    setIsLoading(false);
  }

  async function onSelectSubscription(subscriptionId) {
    if (selectedSubscriptionId === subscriptionId) {
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setSelectedSubscriptionId(subscriptionId);
    setCars([]);

    const url = ENDPOINT.cars(subscriptionId);
    try {
      const response = await axios.get(url);

      if (!response?.data) {
        throw new Error(`no data from ${url}`);
      }

      const carData = (response.data?.results?.bindings || []).map(
        ({ isSuspended, licensePlate, make, model, productionDate, vin, withEngine, image }) => {
          return {
            isSuspended: isSuspended?.value || 'false',
            licensePlate: licensePlate?.value,
            make: make?.value,
            model: model?.value,
            productionDate: productionDate?.value ? new Date(productionDate.value) : null,
            vin: vin?.value,
            withEngine: extractIdentifier(withEngine),
            image: image?.value,
          }
        }
      );

      setCars(carData);
    } catch (e) {
      // TODO error handling with toaster
    }

    setIsLoading(false);
  }

  function onShowDeleteModal(carVIN) {
    setCarVINTonDelete(carVIN);
  }

  function onDeleteModalClose() {
    setCarVINTonDelete(undefined);
  }

  async function onCarDelete() {
    if (!carVINToDelete) {
      return;
    }

    const vin = carVINToDelete;

    onDeleteModalClose();
    setIsLoading(true);

    const url = ENDPOINT.deleteCar(vin);
    try {
      await axios.delete(url);

      setCars(reject(cars, { vin }));
    } catch (e) {
      // TODO error handling with toaster
    }

    setIsLoading(false);
  }

  async function onSubmitNewCarForm() {
    if (!selectedSubscriptionId) {
      window.alert(t('NO_CATEGORY_SELECTED_SUBMIT_FORM'));
      return;
    }

    if (!newCarVIN) {
      window.alert(t('ERROR_ADD_CAR_VIN'));
      return;
    }
    if (!newCarLicensePlate) {
      window.alert(t('ERROR_SELECT_CAR_PLATE'));
      return;
    }
    if (!newCarMake) {
      window.alert(t('ERROR_SELECT_CAR_MAKE'));
      return;
    }

    if (!newCarModel) {
      window.alert(t('ERROR_SELECT_CAR_MODEL'));
      return;
    }

    const url = ENDPOINT.createCar(selectedSubscriptionId);
    try {
      const response = await axios.post(url, {
        vin: newCarVIN,
        licensePlate: newCarLicensePlate,
        make: newCarMake,
        model: newCarModel,
      });

      if (!response.data) {
        throw new Error(`no data from ${url}`);
      }

      setCars([
        ...cars,
        response.data
      ]);

      setNewCarVIN('');
      setNewCarLicensePlate('');
      setNewCarMake('');
      setNewCarModel('');

    } catch (e) {
      if (e.response.data.errorCode) {
        window.alert(t('VIN_ALREADY_EXISTS'));
      }
      // TODO error handling with toaster
    }
  }

  return (
    <Flex flexDirection="column" flex="1">
      {isLoading && (
        <Backdrop>

        </Backdrop>
      )}

      {carVINToDelete && (
        <Modal onClose={onDeleteModalClose}>
          <ModalHeader onClose={onDeleteModalClose}>
            {t('CONFIRMATION_REQUIRED')}
          </ModalHeader>
          <Box flex="1 1" padding={spacing.xl}>
            {t('ARE_YOU_SURE_DELETE', { licensePlate: carVINToDelete })}
          </Box>
          <ModalFooter>
            <Button onClick={onCarDelete}>{t('YES_DELETE')}</Button>
            <Button isSecondary onClick={onDeleteModalClose}>{t('CANCEL')}</Button>
          </ModalFooter>
        </Modal>
      )}

      <Box
        p={spacing.md}
        style={{ borderBottom: `2px solid ${color.silverLight15}` }}
      >
        <Button onClick={onFetchSubscriptionsClick}>
          {t('FETCH_SUBSCRIPTIONS')}
        </Button>
      </Box>

      <Flex flex="1 1 200px" style={{ borderBottom: `2px solid ${color.silverLight15}`, overflow: 'hidden', }}>
        <Box width="280px" style={{ overflow: 'auto' }}>
          {subscriptions.map(({ id, name }) => (
            <Box
              key={id}
              onClick={() => onSelectSubscription(id)}
              style={{
                borderBottom: `3px solid ${color.silverLight15}`,
                padding: `${spacing.md} ${spacing.lg}`,
                cursor: 'pointer',
                fontSize: fontSize.md,
                color: id === selectedSubscriptionId ? color.turquoiseDark20 : color.grayDark30,
                fontWeight: id === selectedSubscriptionId ? fontWeight.xxl : fontWeight.md,
              }}
            >
              {name}
            </Box>
          ))}

          {!subscriptions?.length && (
            <Box
              justifyContent="center"
              alignItems="center"
              height="100%"
              display="flex"
            >
              {t('NO_SUBSCRIPTIONS_TO_SHOW')}
            </Box>
          )}
        </Box>

        <Box flex="1 1" style={{ overflow: 'auto', borderLeft: `2px solid ${color.silverLight15}`, }}>
          {cars.map(({ vin, licensePlate, model, make, withEngine, productionDate, image, isSuspended }) => (
            <Flex
              key={vin}
              p={`${spacing.md} ${spacing.xl}`}
              style={{ borderBottom: `2px solid ${color.silverLight15}` }}
            >
              <Box width="140px">
                <Box style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>
                  {licensePlate}
                </Box>

                <Button
                  isSmall
                  onClick={() => onShowDeleteModal(vin)}
                >
                  {t('DELETE')}
                </Button>
              </Box>

              <Box flex="1 1" style={{ fontSize: fontSize.sm }}>
                <div>{t('VIN')}: {vin}</div>
                <div>{t('MODEL')}: {model}</div>
                <div>{t('MAKE')}: {make}</div>
                <div>{t('ENGINE')}: {withEngine || '-'}</div>
                <div>{t('PRODUCTION_YEAR')}: {productionDate ? productionDate.getFullYear() : 'N/A'}</div>
                <div>{t('SUSPENDED')}: {isSuspended || 'false'}</div>
              </Box>

              {image && (
                <img src={image} alt="Car" style={{ width: '150px' }} />
              )}
            </Flex>
          ))}

          {!cars?.length && (
            <Box
              justifyContent="center"
              alignItems="center"
              height="100%"
              display="flex"
            >
              {t('NO_CARS_TO_SHOW')}
            </Box>
          )}
        </Box>
      </Flex>

      <Box p={spacing.md}>
        <Flex style={{ gap: spacing.md }}>
          <Box flex="1">
            <Box>
              <TextField
                value={newCarVIN}
                onChange={e => setNewCarVIN(e.target.value) }
                prefix={(
                  <TextFieldAddition>{t('VIN')}:</TextFieldAddition>
                )}
              />
            </Box>

            <Box mt={spacing.sm}>
              <TextField
                value={newCarModel}
                onChange={e => setNewCarModel(e.target.value) }
                prefix={(
                  <TextFieldAddition>{t('MODEL')}:</TextFieldAddition>
                )}
              />
            </Box>
          </Box>

          <Box flex="1">
            <Box>
              <TextField
                value={newCarLicensePlate}
                onChange={e => setNewCarLicensePlate(e.target.value) }
                prefix={(
                  <TextFieldAddition>{t('LICENSE_PLATE')}:</TextFieldAddition>
                )}
              />
            </Box>

            <Box mt={spacing.sm}>
              <TextField
                value={newCarMake}
                onChange={e => setNewCarMake(e.target.value) }
                prefix={(
                  <TextFieldAddition>{t('MAKE')}:</TextFieldAddition>
                )}
              />
            </Box>
          </Box>
        </Flex>

        <Box mt={spacing.sm}>
          <Button onMouseEnter={onSubmitNewCarForm} isSecondary>
            {t('ADD_NEW_CAR')}
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}

export default Home;
