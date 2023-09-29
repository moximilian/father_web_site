import * as yup from 'yup';

export const schema = yup.object().shape({
    name:yup.string().required('Обязательное поле'),
    phone:yup.string().min(1).max(18).required('Обязательное поле'),
    email:yup.string().email('Некорректный email аддрес'),
    comment:yup.string().max(300),
}) 