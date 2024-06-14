<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\FacilityResource;
use Illuminate\Http\Request;
use App\Models\Facility;
use App\Http\Resources\Api\FoodcafeResource;
use App\Http\Resources\Api\HotelResource;
use App\Http\Resources\Api\NewsResource;
use App\Models\Foodcafe;
use App\Models\Hotel;
use App\Models\News;
use Carbon\Carbon;

class UserController extends Controller
{
    public function show_facility()
    {
        $facility = Facility::latest()->paginate(6);

        foreach ($facility as $item) {
            $item->image = url('assets/facility/' . $item->image);
            $item->open = Carbon::parse($item->open)->translatedFormat('H:i');
            $item->close = Carbon::parse($item->close)->translatedFormat('H:i');
        }

        return new FacilityResource(true, "Facility Data", $facility);
    }

    public function detail_facility($id)
    {
        $facility = Facility::findOrFail($id);

        $facility->image = url('assets/facility/' . $facility->image);
        $facility->open = Carbon::parse($facility->open)->translatedFormat('H:i');
        $facility->close = Carbon::parse($facility->close)->translatedFormat('H:i');

        return new FacilityResource(true, "Detail Facility", $facility);
    }

    public function show_foodcafe()
    {
        $foodcafe = FoodCafe::latest()->paginate(6);

        foreach ($foodcafe as $item) {
            $item->image = url('assets/foodcafe/' . $item->image);
            $item->open = Carbon::parse($item->open)->translatedFormat('H:i');
            $item->close = Carbon::parse($item->close)->translatedFormat('H:i');
        }

        return new FoodCafeResource(true, "FoodCafe Data", $foodcafe);
    }

    public function detail_foodcafe($id)
    {
        $foodcafe = FoodCafe::findOrFail($id);

        $foodcafe->image = url('assets/foodcafe/' . $foodcafe->image);
        $foodcafe->open = Carbon::parse($foodcafe->open)->translatedFormat('H:i');
        $foodcafe->close = Carbon::parse($foodcafe->close)->translatedFormat('H:i');

        return new FoodcafeResource(true, "Detail FoodCafe", $foodcafe);
    }

    public function show_hotel()
    {
        $hotel = Hotel::latest()->paginate(6);

        foreach ($hotel as $item) {
            $item->image = url('assets/hotel/' . $item->image);
            $item->open = Carbon::parse($item->open)->translatedFormat('H:i');
            $item->close = Carbon::parse($item->close)->translatedFormat('H:i');
        }

        return new HotelResource(true, "Hotel Data", $hotel);
    }

    public function detail_hotel($id)
    {
        $hotel = Hotel::findOrFail($id);

        $hotel->image = url('assets/hotel/' . $hotel->image);
        $hotel->open = Carbon::parse($hotel->open)->translatedFormat('H:i');
        $hotel->close = Carbon::parse($hotel->close)->translatedFormat('H:i');

        return new HotelResource(true, "Detail Hotel", $hotel);
    }

    public function show_news()
    {
        $news = News::latest()->paginate(6);

        foreach ($news as $item) {
            $item->image = url('assets/news/' . $item->image);
            $item->open = Carbon::parse($item->open)->translatedFormat('H:i');
            $item->close = Carbon::parse($item->close)->translatedFormat('H:i');
        }

        return new NewsResource(true, "News Data", $news);
    }

    public function detail_news($id)
    {
        $news = News::findOrFail($id);

        $news->image = url('assets/news/' . $news->image);
        $news->open = Carbon::parse($news->open)->translatedFormat('H:i');
        $news->close = Carbon::parse($news->close)->translatedFormat('H:i');

        return new NewsResource(true, "Detail News", $news);
    }
}
