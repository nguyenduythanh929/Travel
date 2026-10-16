import {getVouchers,VoucherDetail} from "../api/voucherapi";
export default function checkVoucher(discountType:string,discountValue:number){ {
  if(discountType==="PERCENTAGE"){
    return `${discountValue}%`
  }else{
    return `${discountValue.toLocaleString()} VND`
  }
}
}