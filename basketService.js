import httpService from "../httpService";
import localStorageService from "../localStorageService";
const basketEndpoint = "basket/";

const BasketService = {
  //получение корзины
  getAll: async () => {
    const userId = localStorageService.getUserId();
    const { data } = await httpService.get(basketEndpoint, {params:{userId}});
    return data;
  },
  //Увеличение единицы товара на один
  increaseOne: async (cardId) => {
    const userId = localStorageService.getUserId();
    const { data } = await httpService.patch(basketEndpoint + "add/"+ cardId, {userId});
    return data;
  },
  //Уменьшение единицы товара на один
  decreaseOne: async (cardId) => {
    const userId = localStorageService.getUserId();
    const { data } = await httpService.patch(basketEndpoint + "remove/"+ cardId, {userId});
    return data;
  },
  //Полное удаление товара из корзины  
  delete: async (cardId) => {
    const userId = localStorageService.getUserId();
    const { data } = await httpService.delete(basketEndpoint + cardId, { params: {userId } });
    return data;
  },
//Создание корзины
  createBasket: async (cardId) =>{
    const userId = localStorageService.getUserId();
    const { data } = await httpService.post(basketEndpoint + cardId, {userId });
    return data;
  }
 
};

export default BasketService;
