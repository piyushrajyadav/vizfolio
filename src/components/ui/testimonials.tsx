"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonialData = [
  {
    name: "Sarah Johnson",
    handle: "@sarahj_dev",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    title: "Perfect for my portfolio",
    content: "Vizfolio made it incredibly easy to showcase my web development projects. The themes are professional and the customization options are endless."
  },
  {
    name: "Michael Chen",
    handle: "@mike_design",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    title: "Stunning design templates",
    content: "As a designer, I'm very picky about aesthetics. Vizfolio's themes are beautifully crafted and helped me land my dream job."
  },
  {
    name: "Emily Rodriguez",
    handle: "@emily_photo",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    title: "Game changer for photographers",
    content: "The gallery features are incredible for showcasing my photography work. My clients love browsing through my portfolio now."
  },
  {
    name: "David Park",
    handle: "@davidpark_dev",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    title: "Excellent developer experience",
    content: "The integration was seamless and the documentation is top-notch. I had my portfolio up and running in minutes."
  },
  {
    name: "Lisa Thompson",
    handle: "@lisa_writer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    title: "Perfect for content creators",
    content: "I love how easy it is to organize my writing samples and showcase my work. The clean layouts make everything look professional."
  },
  {
    name: "Alex Kumar",
    handle: "@alex_fullstack",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    title: "Impressed with performance",
    content: "The sites load incredibly fast and the SEO optimization helped me get discovered by potential clients. Highly recommended!"
  },
  {
    name: "Rachel Green",
    handle: "@rachel_ux",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    title: "UX designer approved",
    content: "The user experience is flawless. Both creating the portfolio and navigating the final result feel intuitive and polished."
  },
  {
    name: "James Wilson",
    handle: "@james_freelance",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    title: "Boosted my freelance career",
    content: "Since launching my Vizfolio portfolio, I've seen a 300% increase in client inquiries. The professional look really makes a difference."
  }
];

function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [api, current]);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
            Trusted by thousands of creators worldwide
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {testimonialData.map((testimonial, index) => (
                <CarouselItem className="lg:basis-1/2" key={index}>
                  <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-video flex justify-between flex-col">
                    <User className="w-8 h-8 stroke-1" />
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl tracking-tight">
                          {testimonial.title}
                        </h3>
                        <p className="text-muted-foreground max-w-xs text-base">
                          {testimonial.content}
                        </p>
                      </div>
                      <p className="flex flex-row gap-2 text-sm items-center">
                        <span className="text-muted-foreground">By</span>{" "}
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{testimonial.name}</span>
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export { Testimonials };