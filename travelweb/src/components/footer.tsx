import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className=" bg-[#ececec] text-black p-18 mt-10 rounded-t-[30px] ">
      <div className="xl:w-[1280px] mx-auto">
        <div>
          <div className="flex justify-between">
            <ul className="flex gap-5 text-md font-medium ">
              <li>
                <Link href={"/"}>Trang Chủ</Link>
              </li>
              <li>
                <a>Tour Trong Nước</a>
              </li>
              <li>
                <a>Tour Nước Ngoài</a>
              </li>
              <li>
                <a>Tin Tức</a>
              </li>
              <li>
                <a>Liên Hệ</a>
              </li>
            </ul>
            <div className="flex gap-8">
              <Image
                src="/facebook-icon.svg"
                alt="Facebook"
                width={30}
                height={30}
              />
              <Image
                src="/twitte-icon.svg"
                alt="Twitte"
                width={30}
                height={30}
              />
              <Image
                src="/instagram-icon.svg"
                alt="Instagram"
                width={30}
                height={30}
              />
              <Image
                src="/youtube-icon.svg"
                alt="Youtube"
                width={30}
                height={30}
              />
            </div>
          </div>

          <div className="w-full h-[1px] bg-black/30 mt-10"></div>

          <div className="flex justify-between mt-12">
            <p className="text-gray-600">
              © 2025 CT7KMA. Academy of Cryptography Techniques.
            </p>
            <Image src={"/logo.png"} alt="Logo" width={200} height={200} />
            <div className="flex gap-4">
              <a className="text-gray-600 hover:text-blue-700">
                Điều khoản dịch vụ
              </a>
              <a className="text-gray-600 hover:text-blue-700">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
