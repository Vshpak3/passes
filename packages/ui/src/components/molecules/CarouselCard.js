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
        <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
          <span className="text-sm font-medium tracking-tight text-[green]">
            Buy
          </span>
        </span>
      </div>
      <div className="mt-2 text-sm">
        <span className="dark:text-jacarta-300">{org}</span>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span
            className="js-likes relative cursor-pointer before:absolute before:h-4 before:w-4 before:bg-[url('/img/heart-fill.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-0"
            data-tippy-content="Favorite"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="dark:fill-jacarta-200 fill-jacarta-500 hover:fill-red dark:hover:fill-red h-4 w-4"
            >
              <path fill="none" d="M0 0H24V24H0z" />
              <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z" />
            </svg>
          </span>
          <span className="dark:text-jacarta-200 text-sm">999</span>
        </div>
      </div>
    </div>
  </div>
)

export default CarouselCard
