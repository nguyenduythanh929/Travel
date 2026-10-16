import z from "zod";

// Schedule item schema
export const ScheduleItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Vui lòng nhập tiêu đề lịch trình"),
  content: z.string().min(1, "Vui lòng nhập nội dung lịch trình"),
});

export type ScheduleItemType = z.TypeOf<typeof ScheduleItemSchema>;

// Create tour body schema
export const CreateTourBody = z.object({
  name: z.string().min(1, "Vui lòng nhập tên tour!").max(256),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  position: z.coerce.number().int().positive().optional(),
  status: z.enum(["active", "inactive"]),

  // Prices
  priceAdult: z.coerce.number().positive("Giá người lớn phải lớn hơn 0"),
  priceChildren: z.coerce.number().positive("Giá trẻ em phải lớn hơn 0"),
  priceBaby: z.coerce.number().positive("Giá em bé phải lớn hơn 0"),

  priceNewAdult: z.coerce.number().positive().optional(),
  priceNewChildren: z.coerce.number().positive().optional(),
  priceNewBaby: z.coerce.number().positive().optional(),

  // Stock
  stockAdult: z.coerce.number().int().nonnegative(),
  stockChildren: z.coerce.number().int().nonnegative(),
  stockBaby: z.coerce.number().int().nonnegative(),

  // Other info
  locations: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 địa điểm"),
  time: z.string().min(1, "Vui lòng nhập thời gian"),
  vehicle: z.string().min(1, "Vui lòng nhập phương tiện"),
  departureDate: z.string().min(1, "Vui lòng chọn ngày khởi hành"),

  information: z.string().min(1, "Vui lòng nhập thông tin tour"),
  schedule: z
    .array(ScheduleItemSchema)
    .min(1, "Vui lòng thêm ít nhất 1 lịch trình"),

  // Images
  avatar: z.any().optional(), // File upload
});

export type CreateTourBodyType = z.TypeOf<typeof CreateTourBody>;

// Tour response schema
export const TourSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  position: z.number().nullable(),
  status: z.string(),
  priceAdult: z.number(),
  priceChildren: z.number(),
  priceBaby: z.number(),
  priceNewAdult: z.number().nullable(),
  priceNewChildren: z.number().nullable(),
  priceNewBaby: z.number().nullable(),
  stockAdult: z.number(),
  stockChildren: z.number(),
  stockBaby: z.number(),
  locations: z.array(z.string()),
  time: z.string(),
  vehicle: z.string(),
  departureDate: z.string(),
  information: z.string(),
  schedule: z.array(ScheduleItemSchema),
  avatar: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TourType = z.TypeOf<typeof TourSchema>;

export const TourRes = z.object({
  data: TourSchema,
  message: z.string(),
});

export type TourResType = z.TypeOf<typeof TourRes>;

export const TourListRes = z.object({
  data: z.array(TourSchema),
  message: z.string(),
});

export type TourListResType = z.TypeOf<typeof TourListRes>;

export const UpdateTourBody = CreateTourBody;
export type UpdateTourBodyType = CreateTourBodyType;

export const TourParams = z.object({
  id: z.coerce.number(),
});

export type TourParamsType = z.TypeOf<typeof TourParams>;
