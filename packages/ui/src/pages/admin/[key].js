import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import { Fragment, useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Cross from "src/icons/cross"

import { FormInput } from "../../components/form/form-input"

export async function getServerSideProps({ params }) {
  const { key } = params
  if (key !== process.env.DEMO_KEY)
    return {
      notFound: true
    }
  return {
    props: {}
  }
}

const defaultValues = {
  id: "",
  userId: "",
  fullName: "",
  coverTitle: "",
  coverDescription: "",
  isKYCVerified: false,
  profileImageUrl: "",
  profileCoverImageUrl: "",
  description: "",
  instagramUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  discordUrl: "",
  twitchUrl: "",
  facebookUrl: "",
  twitterUrl: "",
  posts: 12,
  likes: 22900,
  isVerified: true,
  isActive: true,
  passes: []
}

const passesDefaultValue = {
  title: "",
  description: "",
  imgUrl: "",
  type: "",
  price: 0,
  id: ""
}

const Admin = () => {
  const [creators, setCreators] = useState([])
  const [open, isOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState()
  const [idToDelete, setIdToDelete] = useState()
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, getValues, reset, watch, control } = useForm({
    defaultValues
  })

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "passes", // unique name for your Field Array
    defaultValues: passesDefaultValue
  })

  const profileImage = watch("profileImage")
  const profileImageUrl = watch("profileImageUrl")
  const profileCoverImage = watch("profileCoverImage")
  const profileCoverImageUrl = watch("profileCoverImageUrl")
  const passes = watch("passes")

  const onClose = () => {
    reset(defaultValues)
    isOpen(false)
    setSelectedCreator(null)
  }

  const onCreatorSelect = (creator) => {
    setSelectedCreator(creator)
    const { _id, ...data } = creator
    reset(data)
    isOpen(!!_id)
  }

  const onDeleteCreator = async () => {
    const url = "/api/demo/" + idToDelete
    await fetch(url, {
      method: "DELETE"
    })
    setIdToDelete()
    setConfirmDeleteOpen(false)
    fetchCreators()
  }

  const fetchCreators = async () => {
    const data = await fetch("/api/demo").then((res) => res.json())
    setCreators(data)
  }

  useEffect(() => {
    fetchCreators()
  }, [])

  const onSubmit = async () => {
    const {
      profileImage: profileImageValue,
      profileCoverImage: profileCoverImageValue,
      passes: passesValue,
      ...rest
    } = getValues()

    setLoading(true)
    try {
      let url = "/api/demo"
      if (selectedCreator) url += "/" + selectedCreator._id
      const [profileImageUrl, profileCoverImageUrl] = await Promise.all(
        [profileImageValue, profileCoverImageValue].map(async (files) => {
          if (!files?.length) return Promise.resolve(null)
          const timestamp = Date.now()
          const file = files[0]
          const url =
            "https://" +
            process.env.NEXT_PUBLIC_DEMO_BUCKET +
            "/demo/" +
            timestamp +
            "_" +
            file.name
          return fetch(url, {
            method: "PUT",
            headers: {
              "x-amz-acl": "public-read"
            },
            body: file
          }).then(() => url)
        })
      )

      const passes = await Promise.all(
        passesValue.map(async (pass, index) => {
          const { image, ...rest } = pass
          if (!image?.length)
            return Promise.resolve({
              ...rest,
              id: `pass_${index}`
            })
          const timestamp = Date.now()
          const file = image[0]
          const url =
            "https://" +
            process.env.NEXT_PUBLIC_DEMO_BUCKET +
            "/demo/" +
            timestamp +
            "_" +
            file.name
          return fetch(url, {
            method: "PUT",
            headers: {
              "x-amz-acl": "public-read"
            },
            body: file
          }).then(() => ({ ...rest, imgUrl: url, id: `pass_${index}` }))
        })
      )

      let data = { ...rest }
      if (profileImageUrl) data.profileImageUrl = profileImageUrl
      if (profileCoverImageUrl) data.profileCoverImageUrl = profileCoverImageUrl
      if (passes.length) data.passes = passes

      await fetch(url, {
        method: selectedCreator ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((res) => res.json())
      await fetchCreators()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#1B141D] px-16 py-8">
        <button
          type="button"
          className="mb-12 inline-flex w-[200px] justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          onClick={() => {
            isOpen(true)
          }}
        >
          Add Creator
        </button>
        <div className="grid grid-cols-6 gap-6">
          {creators.map((creator) => (
            <div
              className="col-span-6 flex cursor-pointer flex-col items-center gap-5 border border-gray-300 p-2 lg:col-span-2"
              key={creator._id}
              onClick={() => onCreatorSelect(creator)}
            >
              <div className="relative h-[300px] w-full">
                {creator.profileImageUrl && (
                  <Image
                    alt=""
                    layout="fill"
                    src={creator.profileImageUrl}
                    objectFit="contain"
                  />
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIdToDelete(creator._id)
                    setConfirmDeleteOpen(true)
                  }}
                  type="button"
                  className="absolute top-1 right-1 rounded-[50%] border bg-indigo-600 p-1"
                >
                  <Cross />
                </button>
              </div>
              {creator.fullName}
            </div>
          ))}
        </div>
      </div>
      <Transition.Root show={open} as={Fragment} appear>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="h-screen items-end justify-center p-0 text-center sm:items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex h-full w-full transform overflow-hidden bg-[#1B141D] px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:p-6">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex h-full w-full flex-col justify-between"
                  >
                    <div className="mb-5 sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-white"
                      >
                        {selectedCreator ? "Update Creator" : "New Creator"}
                      </Dialog.Title>
                    </div>
                    <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="file"
                          register={register}
                          name="profileImage"
                          accept={["image"]}
                          trigger={
                            <div className="relative col-span-2 flex h-[300px] cursor-pointer border border-gray-300 md:col-span-1">
                              {profileImage?.length > 0 || profileImageUrl ? (
                                <Image
                                  alt=""
                                  layout="fill"
                                  src={
                                    profileImage?.length
                                      ? URL.createObjectURL(profileImage[0])
                                      : profileImageUrl
                                  }
                                  objectFit="contain"
                                />
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                >
                                  Upload Profile Image
                                </button>
                              )}
                            </div>
                          }
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="file"
                          register={register}
                          name="profileCoverImage"
                          accept={["image"]}
                          trigger={
                            <div className="relative col-span-2 flex h-[300px] cursor-pointer border border-gray-300 md:col-span-1">
                              {profileCoverImage?.length > 0 ||
                              profileCoverImageUrl ? (
                                <Image
                                  alt=""
                                  layout="fill"
                                  src={
                                    profileCoverImage?.length
                                      ? URL.createObjectURL(
                                          profileCoverImage[0]
                                        )
                                      : profileCoverImageUrl
                                  }
                                  objectFit="contain"
                                />
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                >
                                  Upload Cover Image
                                </button>
                              )}
                            </div>
                          }
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="userId"
                          label="User ID (used in url slug. eg: www.moment.vip/<user_id>)"
                          placeholder="User ID"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="fullName"
                          label="Full Name"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="description"
                          label="Description"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="coverTitle"
                          label="Cover Title"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="coverDescription"
                          label="Cover Description"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="instagramUrl"
                          label="Instagram Url"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="tiktokUrl"
                          label="Tiktok URL"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="youtubeUrl"
                          label="YouTube URL"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="discordUrl"
                          label="Discord URL"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="twitchUrl"
                          label="Twitch URL"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="facebookUrl"
                          label="Facebook URL"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormInput
                          type="text"
                          register={register}
                          name="twitterUrl"
                          label="Twitter URL"
                          className="mb-2 bg-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <span>Passes:</span>
                      </div>
                      {fields.map((pass, index) => (
                        <div
                          className="col-span-2 border border-gray-300 p-4 md:col-span-1"
                          key={pass.id}
                        >
                          <div className="flex justify-between py-2">
                            <span>#{index + 1}</span>
                            <button
                              onClick={() => remove(index)}
                              type="button"
                              className="rounded-[50%] border bg-indigo-600 p-1"
                            >
                              <Cross />
                            </button>
                          </div>

                          <FormInput
                            type="file"
                            register={register}
                            name={`passes.${index}.image`}
                            accept={["image"]}
                            trigger={
                              <div className="relative col-span-2 mb-2 flex h-[300px] cursor-pointer border border-gray-300 md:col-span-1">
                                {passes[index].image?.length > 0 ||
                                passes[index].imgUrl ? (
                                  <Image
                                    alt=""
                                    layout="fill"
                                    src={
                                      passes[index].image?.length
                                        ? URL.createObjectURL(
                                            passes[index].image[0]
                                          )
                                        : passes[index].imgUrl
                                    }
                                    objectFit="contain"
                                  />
                                ) : (
                                  <button
                                    type="button"
                                    className="inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                  >
                                    Upload Post Image
                                  </button>
                                )}
                              </div>
                            }
                          />
                          <FormInput
                            type="text"
                            register={register}
                            name={`passes.${index}.title`}
                            label="Title"
                            className="mb-2 bg-transparent"
                          />
                          <FormInput
                            type="text"
                            register={register}
                            name={`passes.${index}.description`}
                            label="Description"
                            className="mb-2 bg-transparent"
                          />
                          <FormInput
                            type="select"
                            register={register}
                            name={`passes.${index}.type`}
                            label="Type"
                            className="mb-2 bg-transparent"
                            selectOptions={["Free", "Monthly", "Lifetime"]}
                          />
                          <FormInput
                            type="number"
                            register={register}
                            name={`passes.${index}.price`}
                            label="Price"
                            className="mb-2 bg-transparent"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        className="col-span-2 mt-3 inline-flex h-[40px] w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm md:col-span-1"
                        onClick={() => append(passesDefaultValue)}
                      >
                        New Pass
                      </button>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        disabled={loading}
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      >
                        {loading && (
                          <span className="h-5 w-5 animate-spin rounded-[50%] border-4 border-t-4 border-gray-400 border-t-white" />
                        )}
                        <span className="ml-2">
                          {loading ? "Saving..." : "Save"}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Confirm delete modal */}
      <Transition.Root show={confirmDeleteOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setConfirmDeleteOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete Creator
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete creator?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={onDeleteCreator}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setConfirmDeleteOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default Admin
