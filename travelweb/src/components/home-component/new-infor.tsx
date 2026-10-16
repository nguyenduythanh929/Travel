import Image from "next/image";

export default function NewInfor() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-center text-3xl font-bold text-purple-700 mb-12 ">
        Tin Tức Mới
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
        <div className="flex flex-col justify-between gap-6">
          {/* card left top */}
          <article className="relative rounded-2xl overflow-hidden shadow">
            <Image
              src="/blog-1.png"
              alt=""
              width={400}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-800/30 to-transparent p-4 flex flex-col justify-end text-white text-sm">
              <span>23/05/2024</span>
              <p className="font-medium text-base">
                Homestay “cổ tích” giữa Đà Lạt mộng mơ. Lorem ipsum...
              </p>
            </div>
          </article>
          {/* card left bottom */}
          <article className="relative rounded-2xl overflow-hidden shadow">
            <Image
              src="/blog-4.png"
              alt=""
              width={400}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-800/60 to-transparent p-4 flex flex-col justify-end text-white text-sm">
              <span>23/05/2024</span>
              <p className="font-medium text-base">
                Homestay “cổ tích” giữa Đà Lạt mộng mơ. Lorem ipsum...
              </p>
            </div>
          </article>
        </div>

        {/* center big */}
        <article className="rounded-2xl overflow-hidden shadow flex flex-col lg:col-span-2 ">
          <Image
            src="/blog-2.png"
            alt=""
            width={900}
            height={450}
            className="w-full h-80 object-cover"
          />
          <div className="p-6 space-y-3">
            <span className="text-sm text-gray-500">23/05/2024</span>
            <h3 className="text-xl font-semibold text-purple-700">
              Top 5 điểm check in độc đáo tại Singapore
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nếu bạn nghĩ du lịch Singapore rất nhàm chán vì chỉ mãi quanh quẩn
              trong những khối bê tông vô cảm thì bạn “chắc chưa?”...
            </p>
          </div>
        </article>

        <div className="flex flex-col justify-between gap-6">
          {/* card right top */}
          <article className="relative rounded-2xl overflow-hidden shadow">
            <Image
              src="/blog-3.png"
              alt=""
              width={400}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-800/60 to-transparent p-4 flex flex-col justify-end text-white text-sm">
              <span>23/05/2024</span>
              <p className="font-medium text-base">
                Homestay “cổ tích” giữa Đà Lạt mộng mơ. Lorem ipsum...
              </p>
            </div>
          </article>
          {/* card right bottom */}
          <article className="relative rounded-2xl overflow-hidden shadow">
            <Image
              src="/blog-5.png"
              alt=""
              width={400}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-800/60 to-transparent p-4 flex flex-col justify-end text-white text-sm">
              <span>23/05/2024</span>
              <p className="font-medium text-base">
                Homestay “cổ tích” giữa Đà Lạt mộng mơ. Lorem ipsum...
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
