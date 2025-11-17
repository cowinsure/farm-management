// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Calendar, MapPin, Weight, Heart, User } from "lucide-react";
// import placeholder from "../../public/document_placeholder.jpg";
// import Image from "next/image";

// interface ViewAnimalModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   animal: {
//     id: string;
//     name: string;
//     breed: string;
//     age: string;
//     gender: string;
//     weight: string;
//     status: string;
//     location: string;
//   } | null;
// }

// const ViewAnimalModal = ({
//   open,
//   onOpenChange,
//   animal,
// }: ViewAnimalModalProps) => {
//   const [imgSrc, setImgSrc] = useState(
//     `https://insuranceportal-backend.insurecow.com/media/${animal?.location}` ||
//       placeholder
//   );
//   if (!animal) return null;

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800";
//       case "Sick":
//         return "bg-red-100 text-red-800";
//       case "Sold":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   console.log(animal);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-green-600 font-bold text-lg">🐄</span>
//             </div>
//             {animal.name}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Quick Stats */}
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
//             <h3 className="font-semibold text-gray-900 mb-2">Quick Stats</h3>
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div>
//                 <p className="text-2xl font-bold text-green-600">92%</p>
//                 <p className="text-xs text-gray-600">Health Score</p>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-blue-600">1.2yr</p>
//                 <p className="text-xs text-gray-600">On Farm</p>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-purple-600">8.5L</p>
//                 <p className="text-xs text-gray-600">Daily Avg</p>
//               </div>
//             </div>
//           </div>
//           {/* Status and ID Card */}
//           <Card className="border-l-4 border-l-green-500">
//             <CardContent className="p-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm text-gray-600">Animal ID</p>
//                   <p className="text-lg font-semibold">{animal.id}</p>
//                 </div>
//                 <Badge className={getStatusColor(animal.status)}>
//                   {animal.status}
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Basic Information Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Card>
//               <CardContent className="p-4 flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                   <User className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Breed</p>
//                   <p className="font-semibold">{animal.breed}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-4 flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//                   <Heart className="w-5 h-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Gender</p>
//                   <p className="font-semibold">{animal.gender}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-4 flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
//                   <Calendar className="w-5 h-5 text-orange-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Age</p>
//                   <p className="font-semibold">{animal.age}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-4 flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                   <Weight className="w-5 h-5 text-red-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Weight</p>
//                   <p className="font-semibold">{animal.weight}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Location */}
//           <Card>
//             <CardContent className="p-4 flex flex-col">
//               <div className="flex gap-2 items-center">
//                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                   <MapPin className="w-5 h-5 text-green-600" />
//                 </div>
//                 <p className="text-sm text-gray-600">Current Location</p>
//               </div>
//               <div className="mt-5">
//                 <Image
//                   src={imgSrc}
//                   alt={"Image"}
//                   width={256}
//                   height={256}
//                   className="object-cover w-full h-72 rounded-lg"
//                   onError={() => setImgSrc(placeholder)}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ViewAnimalModal;

"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { IoClose, IoColorPaletteSharp } from "react-icons/io5";
import {
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaUser,
  FaRegHeart,
  FaDollarSign,
} from "react-icons/fa";
import {
  MdOutlineLocationOn,
  MdOutlinePermMedia,
  MdOutlineCalendarToday,
} from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TfiRuler } from "react-icons/tfi";
import { LiaWeightSolid } from "react-icons/lia";
import { LuSyringe } from "react-icons/lu";
import FallbackImage from "../FallBackImage";

interface CattleData {
  id: number;
  name: string;
  owner: string;
  asset_type: string;
  breed: string;
  color?: string;
  reference_id?: string;
  age_in_months?: number;
  weight_kg?: string;
  height?: string;
  vaccination_status?: string;
  last_vaccination_date?: string;
  deworming_status?: string;
  last_deworming_date?: string;
  health_issues?: string;
  gender: string;
  muzzle_video?: string;
  left_side_image?: string;
  right_side_image?: string;
  challan_paper?: string;
  vet_certificate?: string;
  chairman_certificate?: string;
  special_mark?: string;
  image_with_owner?: string;
  purchase_date?: string;
  purchase_from?: string;
  purchase_amount?: string;
  current_status?: string;
  vaccine_status?: string;
}

interface ViewAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cattle: CattleData;
}

export default function ViewAnimalModal({
  isOpen,
  onClose,
  cattle,
}: ViewAnimalModalProps) {
  if (!cattle) return null;
  console.log(cattle);
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-5xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <DialogTitle as="h3" className="text-xl font-bold">
                  {cattle.name}
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-red-500"
                >
                  <IoClose size={24} className="cursor-pointer" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:p-4 overflow-x-hidden overflow-y-auto md:overflow-y-hidden max-h-[80vh] md:max-h-auto">
                {/* Left Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 md:col-span-2 shadow-xs md:sticky md:top-0 md:self-start">
                  <div className="flex flex-col gap-8 items-center h-full">
                    {/* Left Image */}
                    <div className="w-64 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                      <FallbackImage
                        src={cattle.left_side_image || ""}
                        alt="Left Side Image"
                        width={256}
                        height={256}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="w-full space-y-3">
                      <CowCardData label="Cow ID" value={cattle.reference_id} />
                      <CowCardData
                        label="Asset Type"
                        value={cattle.asset_type}
                      />
                      <CowCardData label="Breed" value={cattle.breed} />
                      <CowCardData label="Gender" value={cattle.gender} />
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="md:col-span-3 space-y-5 md:max-h-[80vh] md:overflow-y-auto">
                  {/* Basic Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <ModalHeader
                      icon={<MdOutlineCalendarToday />}
                      header="Basic Information"
                    />
                    <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                      <DetailsSection
                        icon={<MdOutlineCalendarToday size={20} />}
                        label="Age"
                        value={cattle.age_in_months}
                        text="months"
                        className="text-green-700 bg-green-200"
                      />
                      <DetailsSection
                        icon={<LiaWeightSolid size={25} />}
                        label="Weight"
                        value={cattle.weight_kg}
                        text="kg"
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        icon={<TfiRuler size={20} />}
                        label="Height"
                        value={cattle.height}
                        text="ft"
                        className="text-purple-700 bg-purple-200"
                      />
                      <DetailsSection
                        icon={<IoColorPaletteSharp />}
                        label="Color"
                        value={cattle.color}
                        className="text-yellow-700 bg-yellow-200"
                      />
                    </div>
                  </div>

                  {/* Health Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-8">
                    <ModalHeader
                      icon={<FaRegHeart />}
                      header="Health Information"
                    />
                    <div className="grid sm:grid-cols-2 gap-8">
                      <DetailsSection
                        icon={<LuSyringe size={20} />}
                        label="Vaccination"
                        value={cattle.vaccine_status || "N/A"}
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        icon={<LuSyringe size={20} />}
                        label="Last Vaccination"
                        value={cattle.last_vaccination_date || "N/A"}
                        className="text-red-700 bg-red-200"
                      />
                      <DetailsSection
                        icon={<IoMdInformationCircleOutline size={25} />}
                        label="Deworming"
                        value={cattle.deworming_status || "N/A"}
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        icon={<IoMdInformationCircleOutline size={25} />}
                        label="Last Deworming"
                        value={cattle.last_deworming_date || "N/A"}
                        className="text-red-700 bg-red-200"
                      />
                    </div>
                  </div>

                  {/* Purchase Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-8">
                    <ModalHeader
                      icon={<FaDollarSign />}
                      header="Purchase & Ownership"
                    />
                    <div className="grid md:grid-cols-2 gap-8">
                      <DetailsSection
                        label="Purchase Amount"
                        value={
                          cattle.purchase_amount
                            ? parseInt(cattle.purchase_amount).toLocaleString()
                            : "N/A"
                        }
                        icon={<FaMoneyBillAlt />}
                        className="text-green-700 bg-green-200"
                      />
                      <DetailsSection
                        label="Purchase Date"
                        value={cattle.purchase_date}
                        icon={<FaCalendarAlt />}
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        label="Purchase From"
                        value={cattle.purchase_from}
                        icon={<MdOutlineLocationOn />}
                        className="text-purple-700 bg-purple-200"
                      />
                      <DetailsSection
                        label="Owner"
                        value={cattle.owner}
                        icon={<FaUser />}
                        className="text-yellow-700 bg-yellow-200"
                      />
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <ModalHeader
                      icon={<MdOutlinePermMedia />}
                      header="Media Information"
                    />
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                      {[
                        ["Right Side Image", cattle.right_side_image],
                        ["Special Mark", cattle.special_mark],
                        ["Image with Owner", cattle.image_with_owner],
                        ["Challan Paper", cattle.challan_paper],
                        ["Vet Certificate", cattle.vet_certificate],
                        ["Chairman Certificate", cattle.chairman_certificate],
                      ].map(([label, url]) => (
                        <div
                          key={label as string}
                          className="border rounded-xl flex flex-col items-center justify-center gap-3 p-4 text-center bg-white"
                        >
                          <span className="font-semibold text-sm truncate w-full">
                            {label}
                          </span>
                          <FallbackImage
                            src={url as string}
                            alt={label as string}
                            width={200}
                            height={140}
                            className="rounded-md object-cover border w-full h-48"
                          />
                        </div>
                      ))}

                      {/* Muzzle Video */}
                      <div className="flex flex-col gap-3 items-center justify-center p-4 rounded-xl border text-center bg-white">
                        <span className="font-semibold text-sm">
                          Muzzle Video
                        </span>
                        {cattle.muzzle_video ? (
                          <video
                            src={cattle.muzzle_video}
                            controls
                            className="w-full h-64 rounded-md object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// ---------------- Helper Components ----------------

interface HeaderProps {
  icon: React.ReactNode;
  header: string;
}

interface DetailsProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number | undefined;
  text?: string;
  className?: string;
}

const ModalHeader = ({ icon, header }: HeaderProps) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-xl text-gray-800">{icon}</span>
    <h4 className="font-semibold text-lg text-gray-800">{header}</h4>
  </div>
);

const DetailsSection = ({
  icon,
  label,
  value,
  text,
  className,
}: DetailsProps) => (
  <div className="flex items-center gap-2">
    {icon && (
      <span
        className={`w-9 h-8 rounded-full flex items-center justify-center text-lg ${
          className || "text-gray-600 bg-gray-100"
        }`}
      >
        {icon}
      </span>
    )}
    <div className="flex flex-col justify-between w-full">
      <label className="text-sm text-gray-500">{label}</label>
      <span className="font-bold text-[#4e4e4e]">
        {value || "N/A"} {text}
      </span>
    </div>
  </div>
);

const CowCardData = ({ icon, label, value }: DetailsProps) => (
  <div className="flex items-center gap-2">
    {icon && (
      <span className="text-green-700 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        {icon}
      </span>
    )}
    <div className="flex justify-between items-center w-full px-1">
      <label className="text-sm font-medium text-gray-500">
        {label || "N/A"}
      </label>
      <span className="font-semibold text-gray-700">
        <span className="px-3 py-1 border border-gray-200 rounded-full">
          {value || "N/A"}
        </span>
      </span>
    </div>
  </div>
);
