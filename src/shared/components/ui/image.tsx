type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

export const Image = ({ src,
    alt,
    width,
    height,
    loading = "lazy",
    decoding = "async",
    ...props
}: ImageProps) => {
    if (!src) return null;
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding={decoding}
            {...props}
        />
    );
}
