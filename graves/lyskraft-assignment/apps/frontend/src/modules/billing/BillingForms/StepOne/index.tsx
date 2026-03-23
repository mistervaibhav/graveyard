import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  TextInput,
  ActionIcon,
  Modal,
  Flex,
  Image,
  Text,
  Title,
  Button,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoAdd } from 'react-icons/io5';
import { useLazyGetProductByBarcodeQuery } from '../../../../redux/products/api';
// import {  } from '../../../../redux/cart/api';
import { ProductWithStocks } from '../../../../redux/products/types';
import { useTypedSelector } from '../../../../redux/useTypedSelector';
import { addOrderItem } from '../../../../redux/cart';
import useAppDispatch from '../../../../redux/useAppDispatch';
import { Store } from '@prisma/client';
import toast from 'react-hot-toast';
import AddedProducts from './AddedProducts';

const StepOne = () => {
  const dispatch = useAppDispatch();
  const [barcode, setBarcode] = useState('');
  const [mtoRemarks, setMtoRemarks] = useState('');
  const [alternateStore, setAlternateStore] = useState<Store | null>(null);
  const [productPreview, setProductPreview] =
    useState<ProductWithStocks | null>(null);

  const currentStoreId = useTypedSelector((store) => store.user.store.id);

  const [getProduct, getProductResult] = useLazyGetProductByBarcodeQuery();

  const [
    isProductPreviewModalOpen,
    { open: openProductPreviewModal, close: closeProductPreviewModal },
  ] = useDisclosure(false);

  const [isMtoModalOpen, { open: openMtoModal, close: closeMtoModal }] =
    useDisclosure(false);

  useEffect(() => {
    if (getProductResult.status === 'fulfilled' && getProductResult.isSuccess) {
      if (!getProductResult.data) {
        setBarcode('');
        toast.error('Product not found', { duration: 1000 });
        return;
      }

      const isAvailableInCurrentStore = getProductResult.data?.stocks.some(
        (item) => item.storeId === currentStoreId && item.quantity > 0
      );

      if (isAvailableInCurrentStore) {
        setBarcode('');
        setAlternateStore(null);
        setProductPreview(null);
        dispatch(
          addOrderItem({
            id: uuid(),
            productId: getProductResult.data.id,
            quantity: 1,
            sellingPrice: getProductResult.data.price,
            billingStoreId: currentStoreId,
            fulfilmentStoreId: currentStoreId,
            color: getProductResult.data.color,
            size: '',
            remarks: null,
            orderId: null,
            stockType: 'READY',
            product: getProductResult.data,
          })
        );
        return;
      }

      const alternateStoreIndex = getProductResult.data?.stocks.findIndex(
        (item) => item.quantity > 0
      );

      if (!Number.isNaN(alternateStoreIndex) && alternateStoreIndex > -1) {
        setBarcode('');
        setAlternateStore(
          getProductResult.data.stocks[alternateStoreIndex]?.store
        );
        setProductPreview(getProductResult.data);
        openProductPreviewModal();
      }

      if (alternateStoreIndex === -1) {
        setProductPreview(getProductResult.data);
        openMtoModal();
      }
    }
  }, [getProductResult]);

  return (
    <div>
      <TextInput
        variant="filled"
        size="md"
        radius="md"
        label="Product Identifier"
        description="From the scanner barcode/QR code"
        w={400}
        value={barcode}
        onChange={(event) => setBarcode(event.target.value)}
        rightSection={
          <ActionIcon
            variant="light"
            onClick={() => {
              if (barcode) {
                getProduct(barcode);
              }
              // getProduct()
            }}
          >
            <IoAdd color="black" />
          </ActionIcon>
        }
      />

      <AddedProducts />

      <Modal
        opened={isProductPreviewModalOpen}
        onClose={closeProductPreviewModal}
        title={
          productPreview?.title ? (
            <Title ff="heading" order={4}>
              {productPreview.title}
            </Title>
          ) : (
            'Product Preview'
          )
        }
        size="lg"
        ff="text"
      >
        <Flex>
          <Image src={productPreview?.image} h={150} w={200} />
          <Flex direction="column" ml="lg">
            <Text>
              <Text size="sm" fw={'bold'}>
                MRP
              </Text>
              INR {productPreview?.price}
            </Text>
            <Text>
              This product is not available in your store. And will be fulfilled
              from this store :
              <Text size="sm" fw={'bold'}>
                {alternateStore?.name}
              </Text>
            </Text>
          </Flex>
        </Flex>
        <Flex justify="flex-end" gap={24} py={8}>
          <Button
            variant="outline"
            onClick={() => {
              setAlternateStore(null);
              setProductPreview(null);
              closeProductPreviewModal();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (
                !productPreview ||
                !alternateStore ||
                !getProductResult.data
              ) {
                return;
              }

              dispatch(
                addOrderItem({
                  id: uuid(),
                  productId: productPreview.id,
                  quantity: 1,
                  sellingPrice: productPreview.price,
                  billingStoreId: currentStoreId,
                  fulfilmentStoreId: alternateStore.id,
                  color: productPreview.color,
                  size: '',
                  remarks: null,
                  orderId: null,
                  stockType: 'READY',
                  product: getProductResult.data,
                })
              );

              closeProductPreviewModal();
            }}
          >
            Confirm
          </Button>
        </Flex>
      </Modal>

      <Modal
        opened={isMtoModalOpen}
        onClose={closeMtoModal}
        title={
          <Title ff="heading" order={4}>
            Product Not in Stock
          </Title>
        }
        size="lg"
        ff="text"
      >
        <Flex
          style={{
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <Image
            style={{
              borderRadius: '8px',
            }}
            src={productPreview?.image}
            h={150}
            w={200}
          />
          <Flex direction="column" ml="lg">
            <Text fw={'bold'}>{productPreview?.title}</Text>
            <Text>
              <Text size="xs" fw={'bold'}>
                MRP
              </Text>
              INR {productPreview?.price}
            </Text>
          </Flex>
        </Flex>
        <Flex direction="column" gap={12} mt={12}>
          <Text size="lg">
            Do you want to manufacture this and deliver to customer ?
          </Text>
          <Textarea
            size="md"
            radius="md"
            label="Remarks (Optional)"
            placeholder="eg. Customer wants a different color."
            value={mtoRemarks}
            onChange={(event) => setMtoRemarks(event.target.value)}
          />
          <Flex justify="flex-end" gap={24}>
            <Button
              variant="outline"
              onClick={() => {
                setBarcode('');
                setMtoRemarks('');
                closeMtoModal();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!productPreview || !getProductResult.data) {
                  return;
                }

                dispatch(
                  addOrderItem({
                    id: uuid(),
                    productId: productPreview.id,
                    quantity: 1,
                    sellingPrice: productPreview.price,
                    billingStoreId: currentStoreId,
                    fulfilmentStoreId: null,
                    color: productPreview.color,
                    size: '',
                    remarks: mtoRemarks,
                    orderId: null,
                    stockType: 'MTO',
                    product: getProductResult.data,
                  })
                );
                setBarcode('');
                setMtoRemarks('');
                closeMtoModal();
              }}
            >
              Confirm
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </div>
  );
};

export default StepOne;
