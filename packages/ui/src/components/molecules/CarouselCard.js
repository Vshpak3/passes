import Image from "next/image"

const CarouselCard = ({ name, img, org, id }) => (
  <div id={id} className="carousel-item relative p-3">
    <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 block rounded-3xl border bg-white p-5 transition-shadow hover:shadow-lg">
      <a href="#">
        <Image
          src={img}
          alt="item 4"
          width="230"
          height="230"
          className="w-full rounded-[0.625rem]"
          loading="lazy"
        />
      </a>
      <div className="mt-4 flex items-center justify-between">
        <a href="#">
          <span className="font-display text-jacarta-700 text-base hover:text-[#8358ff] dark:text-white">
            {name}
          </span>
        </a>
      </div>
      <div className="mt-2 text-sm">
        <span className="dark:text-jacarta-300">{org}</span>
      </div>
    </div>
  </div>
)

export default CarouselCard
