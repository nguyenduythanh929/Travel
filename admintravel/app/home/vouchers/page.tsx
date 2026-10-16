"use client";
import {useEffect, useState} from "react";
import {getVouchers, addVoucher, deleteVoucher, VoucherDetail, VoucherRequest} from "../../api/voucherapi";
import { FiTrash2 } from "react-icons/fi";
import checkVoucher from "../../utils/checkvoucher";

const VoucherItem = ({ id, code ,discountValue ,validTo,discountType, setRerender}: { id: number; code: string; discountValue: number; validTo: any; discountType: string; setRerender: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const handleDeleteVoucher = async () => {
    if (!confirm(`Bạn có chắc muốn xóa voucher ${code}?`)) return;
    try {
      await deleteVoucher(id);
      setRerender((prev) => !prev);
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert("Lỗi khi xóa voucher");
    }
  }
    return (<tr className="border-b">
          <td className="p-3">
            <input type="checkbox" />
          </td>
    
          <td className="p-3 text-center">{code}</td>

          <td className="p-3 text-center">{checkVoucher(discountType, discountValue)}</td>

          <td className="p-3 flex justify-center">
             <button
                onClick={handleDeleteVoucher}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
              >
                <FiTrash2 />
              </button>
          </td>
        </tr>)
}

export default function VoucherPage() {
    const [datavoucher, setDataVoucher] = useState<VoucherDetail[]>();
    const [rerender, setRerender] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<VoucherRequest>({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minPurchaseAmount: 0,
        maxDiscountAmount: 0,
        validFrom: "",
        validTo: "",
        usageLimit: 100,
        isActive: true,
    });

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const vouchers: VoucherDetail[] = await getVouchers();
                console.log("Vouchers:", vouchers);
                setDataVoucher(vouchers);
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            }
        };
        fetchVouchers();
    }, [rerender]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addVoucher(formData);
            setRerender((prev) => !prev);
            setShowForm(false);
            setFormData({
                code: "",
                description: "",
                discountType: "PERCENTAGE",
                discountValue: 0,
                minPurchaseAmount: 0,
                maxDiscountAmount: 0,
                validFrom: "",
                validTo: "",
                usageLimit: 100,
                isActive: true,
            });
        } catch (error) {
            console.error("Error adding voucher:", error);
            alert(error instanceof Error ? error.message : "Lỗi khi thêm voucher");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Voucher</h1>

            <div className="mb-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => setShowForm(true)}
                >
                    Thêm Voucher
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3"></th>
                            <th className="p-3">CodeVoucher</th>
                            <th className="p-3">Giá trị</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {datavoucher?.map((item, i) => (
                            <VoucherItem key={i} {...item} setRerender={setRerender} />
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowForm(false)}
                    />

                    <div className="relative z-10 w-full max-w-lg bg-white rounded-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-4">Thêm Voucher</h2>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Mã voucher *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="VD: SALE50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Mô tả voucher"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Loại giảm giá *</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "PERCENTAGE" | "FIXED_AMOUNT" })}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="PERCENTAGE">Phần trăm (%)</option>
                                        <option value="FIXED_AMOUNT">Số tiền cố định</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Giá trị giảm *</label>
                                    <input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                        required
                                        min={0}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Đơn tối thiểu</label>
                                    <input
                                        type="number"
                                        value={formData.minPurchaseAmount}
                                        onChange={(e) => setFormData({ ...formData, minPurchaseAmount: Number(e.target.value) })}
                                        min={0}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Giảm tối đa</label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscountAmount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                                        min={0}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày bắt đầu *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        required
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày kết thúc *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.validTo}
                                        onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                                        required
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giới hạn sử dụng</label>
                                    <input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                        min={1}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div className="flex items-center pt-6">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium">Kích hoạt</label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded mt-4"
                            >
                                Tạo Voucher
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}